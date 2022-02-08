import React from "react";

type FeedbackParams = { title: string; message?: string; success?: boolean };
type SendFeedback = (FeedbackParams) => void;
function useFeedback(): SendFeedback;

export const Provider: React.FC<{ children: React.ReactNode }>;
export const useFeedback;
export default useFeedback;
