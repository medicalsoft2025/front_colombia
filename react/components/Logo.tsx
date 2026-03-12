import React from "react";
import { getUserCountryUrlPrefix } from "../../services/utilidades";

export const Logo: React.FC = () => {
    return (
        <a className="navbar-brand me-1 me-sm-3" href={`${getUserCountryUrlPrefix()}/Dashboard`}>
            <div className="d-flex align-items-center">
                <div className="d-flex align-items-center" id="">
                    <img src="assets/img/logos/FullColor.svg" alt="phoenix" width="95" />
                </div>
            </div>
        </a>
    );
}
