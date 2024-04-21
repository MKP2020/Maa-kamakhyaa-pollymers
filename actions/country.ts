export type TState = {
  name: string;
  state_code: string;
};

export const getAllStates = async () => {
  const response = await fetch(
    "https://countriesnow.space/api/v0.1/countries/states",
    {
      method: "POST",
      body: JSON.stringify({ country: "India" }),
    }
  ).then((item) => item.json() as any as { data: { states: TState[] } });

  return response?.data?.states || [];
};
