import React from 'react';
import { Megaphone } from 'lucide-react';

interface TickerProps {
    items: string[];
}

const Ticker: React.FC<TickerProps> = ({ items }) => {
    return (
        <div className="container px-4 my-4">
            <div className="flex items-center bg-secondary text-white rounded-lg overflow-hidden shadow-sm">
                <div className="bg-primary px-4 py-2 flex items-center gap-2 font-bold whitespace-nowrap z-10 shadow-md">
                    <Megaphone size={16} />
                    <span>BREAKING | عاجل</span>
                </div>

                <div className="flex-1 overflow-hidden relative h-10 bg-slate-800">
                    <div className="absolute flex items-center h-full animate-[ticker_30s_linear_infinite] whitespace-nowrap pl-[100%]">
                        {items.map((item, index) => (
                            <span key={index} className="mr-12 text-sm font-medium">
                                • {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
};

export default Ticker;
