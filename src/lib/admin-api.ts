import * as fns from "@/lib/admin.functions";

export async function checkAdminAccess() {
  try {
    return await fns.adminCheckAccess();
  } catch {
    return { isAdmin: false };
  }
}

export const listSpine = () => fns.adminListSpine();
export const getHqSummary = () => fns.adminGetHqSummary();
export const listUsers = () => fns.adminListUsers();
export const setUserRole = (userId: string, role: "admin" | "moderator" | "user", grant: boolean) =>
  fns.adminSetUserRole({ data: { userId, role, grant } });

export const listOrganisations = () => fns.adminListOrganisations();
export const updateOrganisation = (
  organisationId: string,
  patch: { status?: "active" | "suspended"; sandboxEnabled?: boolean },
) => fns.adminUpdateOrganisation({ data: { organisationId, ...patch } });

export const listEngagements = () => fns.adminListEngagements();
export const addEngagementNote = (poiId: string, note: string) =>
  fns.adminAddEngagementNote({ data: { poiId, note } });

export const listComplianceCases = () => fns.adminListComplianceCases();
export const updateComplianceCase = (caseId: string, status: string, claim?: boolean) =>
  fns.adminUpdateComplianceCase({ data: { caseId, status, claim } });

export const listIdvReviews = () => fns.adminListIdvReviews();
export const decideIdvReview = (reviewId: string, approve: boolean) =>
  fns.adminDecideIdvReview({ data: { reviewId, approve } });

export const listGovernanceCases = () => fns.adminListGovernanceCases();
export const claimGovernanceCase = (caseId: string) => fns.adminClaimGovernanceCase({ data: { caseId } });

export const listDisputes = () => fns.adminListDisputes();
export const resolveDispute = (disputeId: string, notes: string) =>
  fns.adminResolveDispute({ data: { disputeId, notes } });

export const listLegalHolds = () => fns.adminListLegalHolds();
export const applyLegalHold = (scopeType: string, scopeId: string, reason: string) =>
  fns.adminApplyLegalHold({ data: { scopeType, scopeId, reason } });
export const releaseLegalHold = (holdId: string) => fns.adminReleaseLegalHold({ data: { holdId } });

export const getFunderOverview = () => fns.adminGetFunderOverview();
export const listOnboardingRequests = () => fns.adminListOnboardingRequests();
export const decideOnboardingRequest = (requestId: string, approve: boolean) =>
  fns.adminDecideOnboardingRequest({ data: { requestId, approve } });
export const listFunderOrganisations = () => fns.adminListFunderOrganisations();
export const listDealReleases = () => fns.adminListDealReleases();
export const createDealRelease = (funderOrgId: string, packLabel: string, expiresInDays?: number) =>
  fns.adminCreateDealRelease({ data: { funderOrgId, packLabel, expiresInDays } });
export const revokeDealRelease = (releaseId: string) => fns.adminRevokeDealRelease({ data: { releaseId } });
export const listFunderAuditLog = () => fns.adminListFunderAuditLog();
export const listExecutionCases = () => fns.adminListExecutionCases();

export const getRegistrySummary = () => fns.adminGetRegistrySummary();
export const listRegistryCompanies = () => fns.adminListRegistryCompanies();
export const listRegistryClaims = () => fns.adminListRegistryClaims();
export const decideRegistryClaim = (claimId: string, approve: boolean) =>
  fns.adminDecideRegistryClaim({ data: { claimId, approve } });
export const listBankVerifications = () => fns.adminListBankVerifications();
export const decideBankVerification = (verificationId: string, approve: boolean) =>
  fns.adminDecideBankVerification({ data: { verificationId, approve } });
export const listRegistryApiClients = () => fns.adminListRegistryApiClients();
export const setApiClientStatus = (clientId: string, status: string) =>
  fns.adminSetApiClientStatus({ data: { clientId, status } });
export const listRegistryApiUsage = () => fns.adminListRegistryApiUsage();

export const listEnterpriseIdentity = () => fns.adminListEnterpriseIdentity();

export const listAiTradeRequests = () => fns.adminListAiTradeRequests();
export const sourceCounterparties = (transactionId: string) =>
  fns.adminSourceCounterparties({ data: { transactionId } });
export const listAiSuggestions = () => fns.adminListAiSuggestions();
export const decideAiSuggestion = (suggestionId: string, status: "approved" | "rejected" | "archived") =>
  fns.adminDecideAiSuggestion({ data: { suggestionId, status } });
export const listAiDncRules = () => fns.adminListAiDncRules();
export const addAiDncRule = (ruleType: string, value: string, reason?: string) =>
  fns.adminAddAiDncRule({ data: { ruleType, value, reason } });

export const getRevenueOverview = () => fns.adminGetRevenueOverview();

export const listLegacyRepairFlags = () => fns.adminListLegacyRepairFlags();
export const resolveLegacyFlag = (flagId: string, action: "archive" | "repair") =>
  fns.adminResolveLegacyFlag({ data: { flagId, action } });

export const listGovernanceRecords = () => fns.adminListGovernanceRecords();

export const listAuditLogs = () => fns.adminListAuditLogs();

export const getSystemHealth = () => fns.adminGetSystemHealth();

export const getPlatformSettings = () => fns.adminGetPlatformSettings();
export const updatePlatformSettings = (workspaceName: string, systemStatusMessage: string) =>
  fns.adminUpdatePlatformSettings({ data: { workspaceName, systemStatusMessage } });

export const listLegalEntities = () => fns.adminListLegalEntities();
export const screenLegalEntity = (entityId: string) => fns.adminScreenLegalEntity({ data: { entityId } });
export const verifyLegalEntity = (entityId: string) => fns.adminVerifyLegalEntity({ data: { entityId } });
export const bindLegalEntity = (entityId: string) => fns.adminBindLegalEntity({ data: { entityId } });

export const listGoLiveVerifications = () => fns.adminListGoLiveVerifications();
export const decideGoLiveVerification = (verificationId: string, approve: boolean) =>
  fns.adminDecideGoLiveVerification({ data: { verificationId, approve } });

export const listKycDocuments = () => fns.adminListKycDocuments();
export const reviewKycDocument = (documentId: string, approve: boolean) =>
  fns.adminReviewKycDocument({ data: { documentId, approve } });

export const listOrgApiClients = () => fns.adminListOrgApiClients();
export const createOrgApiClient = (legalEntityId: string, country?: string) =>
  fns.adminCreateOrgApiClient({ data: { legalEntityId, country } });
export const setOrgApiClientAccess = (clientId: string, field: "sandbox_enabled" | "production_enabled", value: boolean) =>
  fns.adminSetOrgApiClientAccess({ data: { clientId, field, value } });

export const listApiPlans = () => fns.adminListApiPlans();
export const createApiPlan = (plan: {
  planName: string;
  currency: string;
  monthlyFee: number;
  includedAllowance: number;
  overagePrice: number;
  manualReviewFee: number;
  overageAllowed: boolean;
}) => fns.adminCreateApiPlan({ data: plan });

export const listSandboxScenarios = () => fns.adminListSandboxScenarios();

export const listApiSupportTickets = () => fns.adminListApiSupportTickets();
export const updateSupportTicketStatus = (ticketId: string, status: string) =>
  fns.adminUpdateSupportTicketStatus({ data: { ticketId, status } });

export const getOrgApiOperations = () => fns.adminGetOrgApiOperations();

export const listRatingAppeals = () => fns.adminListRatingAppeals();
export const listNotificationPreferences = () => fns.adminListNotificationPreferences();
export const listOutreachBlocks = () => fns.adminListOutreachBlocks();
export const listUploadAudit = () => fns.adminListUploadAudit();
export const getRevenueNotifications = () => fns.adminGetRevenueNotifications();
export const runTenantBoundaryProbe = () => fns.adminRunTenantBoundaryProbe();
export const listTenantBoundaryRuns = () => fns.adminListTenantBoundaryRuns();
export const listEventStore = () => fns.adminListEventStore();
export const getSystemAnalytics = () => fns.adminGetSystemAnalytics();

export const listFacilitationCases = () => fns.adminListFacilitationCases();
export const assignFacilitationCase = (caseId: string, status?: string) =>
  fns.adminAssignFacilitationCase({ data: { caseId, status } });
export const listEmailTemplates = () => fns.adminListEmailTemplates();
export const approveEmailTemplate = (templateId: string, approve: boolean) =>
  fns.adminApproveEmailTemplate({ data: { templateId, approve } });
export const listDncRules = () => fns.adminListDncRules();
export const addDncRule = (ruleType: string, value: string, reason?: string) =>
  fns.adminAddDncRule({ data: { ruleType, value, reason } });
export const deleteDncRule = (ruleId: string) => fns.adminDeleteDncRule({ data: { ruleId } });
