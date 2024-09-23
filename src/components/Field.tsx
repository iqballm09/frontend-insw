import React from "react";

export const Field = ({ children, label, error }: any) => {
  const id = getChildId(children);

  return (
    <div className="col-sm-12 mb-3">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
      {error && <small className="error">{error.message}</small>}
    </div>
  );
};

// Get id prop from a child element
export const getChildId = (children: any) => {
  const child = React.Children.only(children);

  if ("id" in child?.props) {
    return child.props.id;
  }
};
