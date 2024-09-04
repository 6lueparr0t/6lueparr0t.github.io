import React from "react";

interface CertificationProps {
  title: string;
  issuer: string;
  date: string;
}

const CertificationCard: React.FC<CertificationProps> = ({ title, issuer, date }) => {
  return (
    <div className="font-noto w-[220px] h-[160px] rounded-lg shadow-2xl flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-950">
      <div className="text-left">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{issuer}</p>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">{date}</div>
    </div>
  );
};

export default CertificationCard;
