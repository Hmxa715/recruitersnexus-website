"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useUserData from "@/lib/db/userData";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import TransactionModal from "../comps/ui/TransactionModal";
import InquiryModal from "../comps/ui/InquiryModal";
import Sidebar from "@/app/(overview)/SideBar";
import NavBar from "@/app/dashboard/components/NavBar";

const TransactionsPage = () => {
  const router = useRouter();
  const { userData } = useUserData();
  const [role, setRole] = useState<string>("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [statusCounts, setStatusCounts] = useState<{ [key: string]: number }>({
    success: 0,
    failed: 0,
    pending: 0,
    refunded: 0
  });
  const [totalAmounts, setTotalAmounts] = useState<{ [key: string]: number }>({
    success: 0,
    failed: 0,
    pending: 0,
    refunded: 0
  });
  const [loading, setLoading] = useState(true);
  const [retryLoading, setRetryLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<{
    requestBody: any;
    responseBody: any;
  } | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    if (userData) {
      setRole(userData.role);
    }
  }, [userData]);

  useEffect(() => {
    if (userData && role) {
      setLoading(true);
      const userId = userData.id;
      fetch(
        `/api/transactions?userId=${userId}&role=${role}&page=${currentPage}&limit=${transactionsPerPage}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch transactions");
          }
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            setTransactions(data.transactions);
            // Set status counts and amounts
            const counts: any = {};
            const amounts: any = {};
            data.summary.forEach((item: any) => {
              counts[item.status] = item.count;
              amounts[item.status] = item.totalAmount;
            });
            setStatusCounts(counts);
            setTotalAmounts(amounts);
            setTotalPages(data.totalPages);
          } else {
            console.error("Invalid transactions data:", data);
            toast.error("Failed to load transactions data");
          }
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          toast.error("Error loading transactions. Please try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [userData, role, currentPage]);

  const handleRefund = async (
    transactionId: number,
    action?: "approve" | "reject"
  ) => {
    const response = await fetch("/api/transactions/refund", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId, role, action })
    });

    const data = await response.json();
    if (data && data.success) {
      toast.success(data.message);
      location.reload();
    } else {
      toast.error(data.error);
      // console.log("Refund api response :", data);
    }
  };

  const handleViewTransaction = async (txnRefNo: string) => {
    if (!txnRefNo) return toast.error("Transaction reference missing.");

    try {
      const response = await fetch(
        `/api/jazzcash/get-transaction?txnRefNo=${txnRefNo}`
      );
      const data = await response.json();

      if (data.success) {
        // console.log("Fetched Transaction Details:", data.details); // Debugging

        setSelectedTxn({
          requestBody: data.details.requestBody,
          responseBody: data.details.responseBody
        });

        setShowModal(true);
      } else {
        toast.error(data.error || "Failed to fetch transaction.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Error fetching transaction.");
    }
  };
  const handleInquire = async (txnRefNo: any) => {
    try {
      const response = await fetch("/api/jazzcash/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txnRefNo })
      });

      const data = await response.json();

      if (data.success) {
        setSelectedInquiry(data.data);
        setShowInquiryModal(true);
      } else {
        toast.error(data.error || "Inquiry failed.");
      }
    } catch (error) {
      console.error("Inquiry Error:", error);
      toast.error("Error fetching inquiry.");
    }
  };
  const handleRetryPayment = async (txn: any) => {
    try {
      setLoading(true);
      setRetryLoading((prev) => ({ ...prev, [txn.txnRefNo]: true }));
      const response = await fetch("/api/jazzcash/initiate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: txn.amount,
          userId: txn.userId,
          plan: txn.plan,
          ...(txn.txnRefNo && { txnRefNo: txn.txnRefNo }),
          isRetry: true
        })
      });

      const data = await response.json();

      if (data.success && data.paymentUrl) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.paymentUrl;

        Object.keys(data.params).forEach((key) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.params[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        toast.error(data.error || "Failed to retry payment.");
      }
    } catch (error) {
      console.error("Retry Payment Error:", error);
      toast.error("Error retrying payment.");
    } finally {
      setLoading(false);
      setRetryLoading((prev) => ({ ...prev, [txn.txnRefNo]: false }));
    }
  };

  useEffect(() => {
    if (selectedTxn && showModal) {
      // console.log("Modal should open with:", selectedTxn.requestBody);
    }
  }, [selectedTxn, showModal]); // ✅ Runs only when `selectedTxn` and `showModal` are set
  return (
    <div className="w-full flex md:flex-row flex-col pt-12 bg-black font-nunito">
      <div className={`${useUserData().userData ? "flex" : "hidden"}`}>
        <NavBar />
      </div>

      <div
        className={`w-full ${
          useUserData().userData ? "md:flex" : "hidden"
        } md:min-w-[250px] md:w-1/5 hidden flex-col p-6 h-full md:h-auto bg-black border-r-2 border-[#A4AC7EB] space-y-6`}
      >
        <Sidebar slug="transactions" />
      </div>

      <div
        className={`w-full ${
          useUserData().userData ? "md:w-4/5" : "w-full"
        } h-full bg-black pb-32`}
      >
        <div className="max-w-7xl mx-auto">
          {!userData && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Loading user data...</p>
            </div>
          )}

          {userData && (
            <>
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                      <p className="text-gray-600">Loading transactions...</p>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !role && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Loading user role...</p>
                </div>
              )}

              {role && (
                <>
                  {/* Cards Section */}
                  {(role === "admin" || role === "hr") && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {loading
                        ? Array(4)
                            .fill(0)
                            .map((_, index) => (
                              <div
                                key={index}
                                className="bg-gray-300 animate-pulse p-6 rounded-lg shadow-md h-24"
                              ></div>
                            ))
                        : ["success", "failed", "pending", "refunded"].map(
                            (status, index) => (
                              <div
                                key={index}
                                className={`${
                                  status === "success"
                                    ? "bg-green-500"
                                    : status === "failed"
                                    ? "bg-red-500"
                                    : status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-blue-500"
                                } text-white p-6 rounded-lg shadow-md flex flex-col items-center 
                            transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg`}
                              >
                                <h2 className="text-xl font-semibold capitalize">
                                  {status}
                                </h2>
                                <p className="text-2xl font-bold mt-2">
                                  {statusCounts[status] || 0}
                                </p>
                                <p className="text-lg mt-1">
                                  Rs {totalAmounts[status] || 0}
                                </p>
                              </div>
                            )
                          )}
                    </div>
                  )}

                  {/* Transactions Table */}
                  <div className="overflow-x-auto bg-white shadow-md rounded-lg flex flex-col justify-start items-center bg-gray-100 px-4 p-5">
                    {transactions.length === 0 && !loading ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">
                          No transactions found
                        </p>
                      </div>
                    ) : (
                      <table className="min-w-full border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-3 border">Txn ID</th>
                            <th className="px-4 py-3 border">Amount</th>
                            <th className="px-4 py-3 border">Status</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-3 border">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {loading
                            ? Array(10)
                                .fill(0)
                                .map((_, index) => (
                                  <tr
                                    key={index}
                                    className="border-b text-center"
                                  >
                                    {Array(5)
                                      .fill(0)
                                      .map((_, i) => (
                                        <td
                                          key={i}
                                          className="px-4 py-3 border"
                                        >
                                          <div className="bg-gray-300 animate-pulse h-5 rounded-md"></div>
                                        </td>
                                      ))}
                                  </tr>
                                ))
                            : transactions.map((txn) => (
                                <tr
                                  key={txn.id}
                                  className="border-b text-center"
                                >
                                  <td className="px-4 py-3 border">
                                    {txn.txnRefNo}
                                  </td>
                                  <td className="px-4 py-3 border">
                                    Rs/-{txn.amount}
                                  </td>
                                  <td className="px-4 py-3 border">
                                    <span
                                      className={`px-2 py-1 rounded-md text-xs font-medium text-white inline-block
                                  ${
                                    txn.status === "success"
                                      ? "bg-green-500"
                                      : txn.status === "failed"
                                      ? "bg-red-500"
                                      : txn.status === "pending"
                                      ? "bg-yellow-500"
                                      : txn.status === "refunded"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                  }`}
                                    >
                                      {txn.status
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (char: string) =>
                                          char.toUpperCase()
                                        )}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 border">
                                    {new Date(txn.createdAt).toLocaleString(
                                      "en-US",
                                      {
                                        month: "short",
                                        day: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                        hour12: true
                                      }
                                    )}
                                  </td>
                                  <td className="px-4 py-3 flex justify-center space-x-2">
                                    {role === "admin" && (
                                      <>
                                        <button
                                          className="bg-blue-500 text-white px-2 py-1 rounded"
                                          onClick={() =>
                                            handleViewTransaction(txn.txnRefNo)
                                          }
                                        >
                                          View
                                        </button>
                                        <button
                                          className="bg-purple-500 text-white px-2 py-1 rounded ml-2"
                                          onClick={() =>
                                            handleInquire(txn.txnRefNo)
                                          }
                                        >
                                          Inquire
                                        </button>
                                      </>
                                    )}
                                    {role === "user" &&
                                      txn.status === "success" && (
                                        <button
                                          className="bg-blue-500 text-white px-2 py-1 rounded"
                                          onClick={() => handleRefund(txn.id)}
                                        >
                                          Request Refund
                                        </button>
                                      )}
                                    {txn.status === "pending" &&
                                      role === "user" && (
                                        <button
                                          className={`bg-orange-500 text-white px-2 py-1 rounded flex items-center ${
                                            retryLoading[txn.txnRefNo]
                                              ? "opacity-50 cursor-not-allowed"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            handleRetryPayment(txn)
                                          }
                                          disabled={retryLoading[txn.txnRefNo]}
                                        >
                                          {retryLoading[txn.txnRefNo] ? (
                                            <>
                                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                              Processing...
                                            </>
                                          ) : (
                                            "Retry Payment"
                                          )}
                                        </button>
                                      )}

                                    {role === "admin" &&
                                      txn.status === "refund_requested" && (
                                        <>
                                          <button
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() =>
                                              handleRefund(txn.id, "approve")
                                            }
                                          >
                                            Approve
                                          </button>
                                          <button
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() =>
                                              handleRefund(txn.id, "reject")
                                            }
                                          >
                                            Reject
                                          </button>
                                        </>
                                      )}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex justify-center mt-6 space-x-2">
                      <button
                        className={`px-4 py-2 text-sm rounded-md ${
                          currentPage === 1
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          className={`px-4 py-2 text-sm rounded-md ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        className={`px-4 py-2 text-sm rounded-md ${
                          currentPage === totalPages
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {showModal && selectedTxn && (
                    <TransactionModal
                      requestBody={selectedTxn.requestBody}
                      responseBody={selectedTxn.responseBody}
                      onClose={() => setShowModal(false)}
                    />
                  )}
                  {showInquiryModal && (
                    <InquiryModal
                      inquiryData={selectedInquiry}
                      onClose={() => setShowInquiryModal(false)}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div
        className={`w-full ${
          useUserData().userData ? "md:hidden" : "hidden"
        } fixed bottom-0 z-20 md:min-w-[250px] border-t-2 md:w-1/5 items-center justify-center flex-col py-0 h-24 md:h-auto bg-black border-r-2 border-[#A4AC7EB] space-y-6`}
      >
        <Sidebar slug="transactions" />
      </div>
    </div>
  );
};

export default TransactionsPage;
