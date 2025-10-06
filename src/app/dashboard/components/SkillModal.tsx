import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface SkillModalProps {
  onClose: () => void;
  onSubmit: (skill: string) => void;
}

const SkillModal: React.FC<SkillModalProps> = ({ onClose, onSubmit }) => {
  const [skill, setSkill] = useState("");

  const handleSubmit = () => {
    if (skill.trim() === "") {
      toast.error("Please enter a skill..")
      // alert("Please enter a skill.");
      return;
    }
    onSubmit(skill);
    setSkill("");
    onClose();
  };

  return (
    <div className="fixed text-black inset-0 z-10 overflow-y-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={onClose}></div>
      <div className="bg-white p-8 rounded-lg max-w-md relative z-20">
        <h2 className="text-2xl font-bold mb-4">Add Skill</h2>
        <input type="text" value={skill} onChange={(e) => setSkill(e.target.value)} placeholder="Skill" className="input py-3.5 px-4 bg-black w-full outline-none rounded-xl mb-4" />
        <div className="flex justify-end space-x-6">
          <Button onClick={onClose} className="bg-[#ECF2FF] text-[#4765FF] hover:bg-[#ECF2FF]/80  h-11 rounded-lg">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#4765FF] hover:bg-[#4765FF]/80  h-11 rounded-lg">Add Skill</Button>
        </div>
      </div>
    </div>
  );
};

export default SkillModal;
