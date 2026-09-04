import { supabase } from "@/integrations/supabase/client";
import * as fns from "@/lib/spine.functions";

/**
 * Client-side facade over the app's own server functions. The upstream build
 * talked to a separate Express service; here the same spine runs inside this
 * app, so every call below is an authenticated RPC to a server function.
 */

export async function signUp(name: string, email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/dashboard` },
  });
  if (error) throw new Error(error.message);
  if (!data.session) throw new Error("Check your inbox to confirm your email, then sign in.");
  return await fns.startSession();
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return await fns.startSession();
}

export async function logout() {
  await supabase.auth.signOut();
}

export async function isLoggedIn() {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
}

export const startSession = () => fns.startSession();
export const getWallet = () => fns.getWallet();
export const listTransactions = () => fns.listTransactions();

export const createTokenPurchase = (tokens: number) => fns.createTokenPurchase({ data: { tokens } });
export const getTokenPurchase = (sessionId: string) => fns.getTokenPurchase({ data: { sessionId } });
export const settlePayment = (sessionId: string) => fns.settlePayment({ data: { sessionId } });

export const createBidOffer = (payload: Record<string, unknown>) => fns.createBidOffer({ data: payload });
export const createOtherDocument = (payload: Record<string, unknown>) =>
  fns.createOtherDocument({ data: payload });
export const createSocialNewsItem = (payload: Record<string, unknown>) =>
  fns.createSocialNewsItem({ data: payload });
export const createSearchRun = (payload: Record<string, unknown>) => fns.createSearchRun({ data: payload });
export const createAiAnalysis = (payload: Record<string, unknown>) => fns.createAiAnalysis({ data: payload });
export const createDecisionSession = (payload: Record<string, unknown>) =>
  fns.createDecisionSession({ data: payload });
export const generateChoiceSet = (decisionSessionId: string) =>
  fns.generateChoiceSet({ data: { decisionSessionId } });
export const materialiseCounterparties = (transactionId: string) =>
  fns.materialiseCounterparties({ data: { transactionId } });
export const createChoice = (transactionId: string, payload: Record<string, unknown>) =>
  fns.createChoice({ data: { ...payload, transaction_id: transactionId } });
export const createIntent = (transactionId: string) => fns.createIntent({ data: { transactionId } });
export const createPoi = (payload: Record<string, unknown>) => fns.createPoi({ data: payload });
export const sealPoi = (poiId: string) => fns.sealPoi({ data: { poiId } });
export const createWad = (payload: Record<string, unknown>) => fns.createWad({ data: payload });
export const createExecution = (payload: Record<string, unknown>) => fns.createExecution({ data: payload });
export const createMilestone = (executionId: string, payload: { title: string }) =>
  fns.createMilestone({ data: { executionId, title: payload.title } });
export const exitExecution = (executionId: string) => fns.exitExecution({ data: { executionId } });
export const createFinality = (payload: Record<string, unknown>) => fns.createFinality({ data: payload });
export const issueFinality = (finalityId: string) => fns.issueFinality({ data: { finalityId } });
export const getCda = (transactionId: string) => fns.getCda({ data: { transactionId } });
export const getLineage = (transactionId: string) => fns.getLineage({ data: { transactionId } });
export const getTransaction = (transactionId: string) => fns.getTransactionView({ data: { transactionId } });
