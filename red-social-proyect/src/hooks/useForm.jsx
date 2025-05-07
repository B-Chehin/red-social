import React from "react";
import { useState } from "react";

export const useForm = (initialObj = {}) => {
  const [form, setForm] = useState(initialObj);

  const changed = ({ target }) => {
    const { name, value } = target;
    console.log(name, value);
    setForm({ ...form, [name]: value });
  };

  return {
    form,
    changed,
  };
};
