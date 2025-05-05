import React from "react";

interface CertificationProps {
  id: string;
  title: string;
  issuer: string;
  date: string;
  expired: string;
}

const CertificationCard: React.FC<CertificationProps> = ({ id, title, issuer, date, expired }) => {
  return (
    <div className="font-noto w-[220px] h-[160px] rounded-lg shadow-2xl flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-950 dark:border-slate-50">
      <div className="text-left">
        <h3 className="text-xl font-bold" title={id}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{issuer}</p>
      </div>
      <div className="text-sm text-gray-700 dark:text-gray-300 mt-4" title={expired}>
        {date}
      </div>
    </div>
  );
};

export default CertificationCard;
