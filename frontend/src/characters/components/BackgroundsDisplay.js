import React from "react";
import SymbolDisplay from "./SymbolDisplay";

const BackgroundsDisplay = ({ backgrounds }) => {
    const thirdIndex = Math.ceil(backgrounds.length / 3);
    const firstColumn = backgrounds.slice(0, thirdIndex);
    const secondColumn = backgrounds.slice(thirdIndex, thirdIndex*2);
    const thridColumn = backgrounds.slice(thirdIndex*2);

    return (
        <Test backgrounds={backgrounds} />
        // <div className="backgrounds-section">
        //     <div className="row">
        //         <div className="col-md-4">
        //             <ul className="list-group">
        //                 {firstColumn.map((background, index) => (
        //                     <li key={index} className="list-group-item">
        //                         <div className="row">
        //                             <div className="col-md-6 text-end">
        //                                 {background.name}
        //                             </div>
        //                             <div className="col-md-6 text-start">
        //                                 <SymbolDisplay value={background.value + background.bonusValue}/>
        //                             </div>
        //                         </div>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //         <div className="col-md-4">
        //             <ul className="list-group">
        //                 {secondColumn.map((background, index) => (
        //                     <li key={index} className="list-group-item">
        //                         <div className="row">
        //                             <div className="col-md-6 text-end">
        //                                 {background.name}
        //                             </div>
        //                             <div className="col-md-6 text-start">
        //                                 <SymbolDisplay value={background.value + background.bonusValue}/>
        //                             </div>
        //                         </div>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //         <div className="col-md-4">
        //             <ul className="list-group">
        //                 {thridColumn.map((background, index) => (
        //                     <li key={index} className="list-group-item">
        //                         <div className="row">
        //                             <div className="col-md-6 text-end">
        //                                 {background.name}
        //                             </div>
        //                             <div className="col-md-6 text-start">
        //                                 <SymbolDisplay value={background.value + background.bonusValue}/>
        //                             </div>
        //                         </div>
        //                     </li>
        //                 ))}
        //             </ul>
        //         </div>
        //     </div>
        // </div>
    );
};

export default BackgroundsDisplay;

const Test = ({ backgrounds }) => {

    return (
        <div>
            <ul className="list-group">
                {backgrounds.map((background, index) => (
                    <div>
                    {background.value + background.bonusValue + background.novaValue > 0 && (
                        <li key={index} className="list-group-item">
                            <div className="row">
                                <div className="col-md-6 text-end">
                                    {background.name}
                                </div>
                                <div className="col-md-6 text-start">
                                    <SymbolDisplay value={background.value + background.bonusValue + background.novaValue} />
                                </div>
                            </div>
                        </li>
                    )}

                    </div>
                ))}
            </ul>
        </div>
    );

};
