import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const ErrorPage = () => {
    const navigate = useNavigate()
    return (
        <div className="container text-center mt-5">
            <h1 className="display-3">404</h1>
            <p className="lead">Oops! The page you are looking for does not exist.</p>
            <button className="btn btn-secondary p-1 m-0 fs-6" onClick={() => navigate(-1)}>Go Back</button>
        </div>
    );
};
