"use client";
import React, { useEffect } from "react";

import { useAppState } from "@/provider/AppProvider";

const FormDo = () => {
  const context = useAppState();

  return <div>{context.forms[context.formIndex]}</div>;
};

export default FormDo;
