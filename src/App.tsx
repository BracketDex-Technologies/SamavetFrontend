import {
  ArrowLeft,
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Clock,
  Plus,
  ReceiptText,
  RefreshCw,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Upload,
  UserCog,
  UsersRound,
  WalletCards,
  X,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, PointerEvent, ReactNode } from 'react';
import { apiRequest } from './api/client';

type PaymentMode = 'CASH' | 'UPI' | 'CHEQUE' | 'BANK_TRANSFER' | 'OTHER';
type TextAlign = 'left' | 'center' | 'right';
type TextWrapMode = 'single' | 'wrap' | 'shrink';
type TextDecoration = 'none' | 'underline' | 'line-through';
type UserRole = 'MANDAL_ADMIN' | 'KHAJINDAR' | 'GROUP_LEADER' | 'MEMBER' | 'SUPER_ADMIN';
type AdhyakshScreen = 'members' | 'tasks' | 'expenses' | 'template' | 'slips' | 'form' | 'users' | 'logs';
type OwnerScreen = 'dashboard' | 'mandals';
type OwnerMandalTab = 'overview' | 'template';
type Language = 'en' | 'mr' | 'hi';
type ExpenseStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

interface TemplatePlacement {
  autoMarathi?: boolean;
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  color: string;
  fontFamily: string;
  fontSize: number;
  fontStyle: 'normal' | 'italic';
  fontWeight: number;
  height: number;
  letterSpacing: number;
  lineHeight: number;
  opacity: number;
  padding: number;
  rotate: number;
  script?: string;
  shadow: boolean;
  strikeout?: boolean;
  textAlign: TextAlign;
  textDecoration: TextDecoration;
  textTransform: 'none' | 'uppercase' | 'capitalize';
  textWrap: TextWrapMode;
  width: number;
  x: number;
  y: number;
}

interface TemplateAssetUpload {
  bucket: string | null;
  key: string | null;
  storage: 'inline' | 'supabase';
  url: string;
}

interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: { id: string; mandalId: string | null; name: string; role: UserRole };
}

interface CustomField {
  dashboardFilter?: boolean;
  id: string;
  key: string;
  label: string;
  options?: string[];
  printOnSlip?: boolean;
  required: boolean;
  sortOrder: number;
  type: string;
}

interface Festival {
  id: string;
  name: string;
  status: string;
  templates?: Template[];
  targetAmount?: number | string | null;
  type: string;
}

interface Member {
  collectionTotal?: number | string | null;
  id: string;
  areaName?: string | null;
  displayName: string;
  paidSlipCount?: number;
  phone?: string | null;
  group?: { id: string; name: string; areaName?: string | null } | null;
  groupId?: string | null;
  user?: { email?: string | null; id?: string; name: string; phone?: string | null; role: UserRole; status: string };
  userId?: string | null;
}

interface Group {
  collectionTotal?: number | string | null;
  id: string;
  areaName?: string | null;
  name: string;
  leader?: { id?: string; name: string; phone?: string | null } | null;
  members?: Member[];
  paidSlipCount?: number;
  _count?: { members: number; slips: number };
}

function getMemberUserId(member: Member) {
  return member.user?.id ?? member.userId ?? '';
}

interface Slip {
  id: string;
  amount: string | number;
  areaName?: string | null;
  collector?: { id: string; name: string; phone?: string | null } | null;
  contributorAddress?: string | null;
  contributorName: string;
  contributorPhone?: string | null;
  collectedByUserId?: string | null;
  createdAt: string;
  customData?: Record<string, string>;
  groupId?: string | null;
  paymentMode: PaymentMode;
  shopName?: string | null;
  slipNumber: string;
  status?: string;
}

interface Template {
  id: string;
  name: string;
  status: string;
  versions: Array<{
    id: string;
    backgroundFileUrl: string;
    canvasHeight: number;
    canvasWidth: number;
    isActive: boolean;
    renderConfig?: { fields?: Record<string, Partial<TemplatePlacement>> };
    version: number;
  }>;
}

interface ActiveForm {
  customFields: CustomField[];
  festival: Festival;
  member?: Member | null;
}

interface CollectionReport {
  balance: number;
  byCollector?: Array<{ collectorName: string; slipCount: number; totalAmount: number }>;
  byPaymentMode?: Array<{ paymentMode: PaymentMode; slipCount: number; totalAmount: number }>;
  slipCount: number;
  totalCollection: number;
  totalExpenses: number;
}

interface Expense {
  id: string;
  amount: number | string;
  billFileUrl?: string | null;
  category?: { id: string; name: string } | null;
  categoryId?: string | null;
  createdAt?: string;
  creator?: { id: string; name: string } | null;
  expenseDate: string;
  notes?: string | null;
  status: ExpenseStatus;
  vendorName?: string | null;
}

interface FestivalTask {
  id: string;
  assignee?: { id: string; name: string; role: UserRole } | null;
  assigneeUserId?: string | null;
  dueDate?: string | null;
  group?: { id: string; name: string; areaName?: string | null } | null;
  groupId?: string | null;
  notes?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  title: string;
}

interface DemoMandal {
  _count?: { festivals?: number; members?: number; slips?: number };
  additionalMembers: string;
  address: string;
  adhyakshName: string;
  adminEmail?: string;
  adminPassword?: string;
  city: string;
  contactEmail?: string;
  contactPhone: string;
  festivals?: Festival[];
  khajindarName: string;
  logoUrl?: string;
  locality: string;
  memberCount?: string;
  name: string;
  id?: string;
  slug?: string;
  status?: string;
  users?: MandalLoginUser[];
}

interface MandalLoginUser {
  createdAt?: string;
  email?: string | null;
  id: string;
  name: string;
  phone?: string | null;
  role: UserRole;
  status: string;
}

interface WorkspaceUser {
  email: string;
  id: string;
  mandalId?: string | null;
  name: string;
  phone?: string | null;
  role: UserRole;
  status: string;
}

interface OwnerWorkspaceBootstrap {
  generatedAt: string;
  kind: 'OWNER';
  mandals: {
    items: Array<DemoMandal & { contactName?: string | null; contactPhone?: string | null; logoUrl?: string | null; festivals?: Festival[]; users?: MandalLoginUser[] }>;
    meta: { limit: number; page: number; total: number; totalPages: number };
  };
  metrics: {
    totalMandals: number;
    totalMembers: number;
    totalSlips: number;
  };
  user?: WorkspaceUser | null;
}

interface MandalWorkspaceBootstrap {
  activeForm: ActiveForm | null;
  generatedAt: string;
  groups: Group[];
  kind: 'MANDAL';
  mandal?: DemoMandal | null;
  members: Member[];
  metrics?: Record<string, number>;
  report: CollectionReport | null;
  slips: { items: Slip[]; meta: { limit: number; page: number; total: number; totalPages: number } };
  templates: Template[];
  user?: WorkspaceUser | null;
}

type WorkspaceBootstrap = OwnerWorkspaceBootstrap | MandalWorkspaceBootstrap;

const SESSION_KEY = 'digital-vargani-admin-session';
const SESSION_EXPIRED_EVENT = 'digital-vargani-session-expired';
const LANGUAGE_KEY = 'digital-vargani-language';
const DEFAULT_OWNER_IDENTIFIER = 'owner@digitalvargani.local';
const TEMPLATE_IMAGE = '/templates/default-vargani-receipt.svg';

const translations: Record<Exclude<Language, 'en'>, Record<string, string>> = {
  hi: {},
  mr: {},
};

const cleanTranslations: Record<Language, Record<string, string>> = {
  en: {},
  hi: {
    'Add Mandal': 'मंडल जोड़ें',
    'Add mandals and manage each client account.': 'मंडल जोड़ें और हर ग्राहक खाते को संभालें.',
    'Address': 'पता',
    'Adhyaksh Login': 'अध्यक्ष लॉगिन',
    'Back to Mandals': 'मंडल पर वापस',
    'Dashboard': 'डैशबोर्ड',
    'Digital Vargani': 'डिजिटल वर्गणी',
    'Generate Login': 'लॉगिन बनाएं',
    'Generate More Logins': 'और लॉगिन बनाएं',
    'Hindi': 'हिंदी',
    'Login URL': 'लॉगिन URL',
    'Logout': 'लॉग आउट',
    'Mandal name is required. Address, logo, contacts and member count are optional.': 'मंडल का नाम आवश्यक है. पता, लोगो, संपर्क और सदस्य संख्या वैकल्पिक हैं.',
    'Mandals': 'मंडल',
    'Marathi': 'मराठी',
    'Members': 'सदस्य',
    'Overview': 'अवलोकन',
    'Password': 'पासवर्ड',
    'Phone No.': 'फोन नंबर',
    'Save Template': 'टेम्पलेट सेव करें',
    'Saved': 'सेव हो गया',
    'Search': 'खोजें',
    'Search mandals by name, area, email...': 'नाम, क्षेत्र या ईमेल से मंडल खोजें...',
    'Slips Generated': 'बनी हुई पावती',
    'Slip Settings': 'पावती सेटिंग्स',
    'Slip Size': 'पावती आकार',
    'Super Admin Console': 'सुपर एडमिन कंसोल',
    'Template': 'टेम्पलेट',
    'Template Size': 'टेम्पलेट आकार',
    'Total Mandals': 'कुल मंडल',
    'Total Members': 'कुल सदस्य',
    'Upload Template': 'टेम्पलेट अपलोड करें',
    'Username': 'यूजरनेम',
    'Field Mapping': 'फील्ड मैपिंग',
    'Place boxes exactly on printed slip labels.': 'बॉक्स को छपी हुई पावती के लेबल पर ठीक से रखें.',
    'Selected Field': 'चुना हुआ फील्ड',
  },
  mr: {
    'Add Mandal': 'मंडळ जोडा',
    'Add mandals and manage each client account.': 'मंडळे जोडा आणि प्रत्येक ग्राहक खाते व्यवस्थापित करा.',
    'Address': 'पत्ता',
    'Adhyaksh Login': 'अध्यक्ष लॉगिन',
    'Back to Mandals': 'मंडळांकडे परत',
    'Dashboard': 'डॅशबोर्ड',
    'Digital Vargani': 'डिजिटल वर्गणी',
    'Generate Login': 'लॉगिन तयार करा',
    'Generate More Logins': 'अधिक लॉगिन तयार करा',
    'Hindi': 'हिंदी',
    'Login URL': 'लॉगिन URL',
    'Logout': 'लॉग आउट',
    'Mandal name is required. Address, logo, contacts and member count are optional.': 'मंडळाचे नाव आवश्यक आहे. पत्ता, लोगो, संपर्क आणि सदस्य संख्या ऐच्छिक आहेत.',
    'Mandals': 'मंडळे',
    'Marathi': 'मराठी',
    'Members': 'सदस्य',
    'Overview': 'आढावा',
    'Password': 'पासवर्ड',
    'Phone No.': 'फोन नंबर',
    'Save Template': 'टेम्पलेट सेव्ह करा',
    'Saved': 'सेव्ह झाले',
    'Search': 'शोधा',
    'Search mandals by name, area, email...': 'नाव, परिसर किंवा ईमेलने मंडळ शोधा...',
    'Slips Generated': 'तयार झालेल्या पावत्या',
    'Slip Settings': 'पावती सेटिंग्ज',
    'Slip Size': 'पावती आकार',
    'Super Admin Console': 'सुपर अॅडमिन कन्सोल',
    'Template': 'टेम्पलेट',
    'Template Size': 'टेम्पलेट आकार',
    'Total Mandals': 'एकूण मंडळे',
    'Total Members': 'एकूण सदस्य',
    'Upload Template': 'टेम्पलेट अपलोड करा',
    'Username': 'वापरकर्ता नाव',
    'Field Mapping': 'फील्ड मॅपिंग',
    'Place boxes exactly on printed slip labels.': 'बॉक्स छापलेल्या पावतीवरील लेबलवर अचूक ठेवा.',
    'Selected Field': 'निवडलेले फील्ड',
  },
};
function t(language: Language, text: string) {
  if (language === 'en') return text;
  return cleanTranslations[language][text] ?? translations[language][text] ?? text;
}

export default function App() {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [activeForm, setActiveForm] = useState<ActiveForm | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [slips, setSlips] = useState<Slip[]>([]);
  const [tasks, setTasks] = useState<FestivalTask[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [report, setReport] = useState<CollectionReport | null>(null);
  const [, setSelectedSlip] = useState<Slip | null>(null);
  const [templatePreview, setTemplatePreview] = useState<string>(TEMPLATE_IMAGE);

  const handlePreviewChange = useCallback((url: string) => {
    setTemplatePreview(resolveTemplateAssetUrl(url));
  }, []);
  const [notice, setNotice] = useState('Login with main mandal admin to open the console.');
  const [authReady, setAuthReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [busyMessage, setBusyMessage] = useState('');
  const [workspaceRefreshing, setWorkspaceRefreshing] = useState(false);
  const [workspaceLoaded, setWorkspaceLoaded] = useState(false);
  const [demoMandals, setDemoMandals] = useState<DemoMandal[]>([]);
  const [currentMandal, setCurrentMandal] = useState<DemoMandal | null>(null);
  const [collectorModalOpen, setCollectorModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const whatsappWindowRef = useRef<Window | null>(null);
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
    return stored === 'mr' || stored === 'hi' ? stored : 'en';
  });

  const mandalId = session?.user.mandalId;
  const festivalId = activeForm?.festival.id;
  const filteredSlips = slips.filter((slip) => {
    const haystack = `${slip.slipNumber} ${slip.contributorName} ${slip.shopName ?? ''} ${slip.areaName ?? ''}`;
    return haystack.toLowerCase().includes(query.toLowerCase());
  });
  const activeTemplate = templates.find((template) =>
    template.versions.some((version) => version.isActive),
  );
  const latestTemplateVersion = activeTemplate?.versions.find((version) => version.isActive);
  useEffect(() => {
    void (async () => {
      const stored = window.localStorage.getItem(SESSION_KEY);
      if (!stored) {
        setAuthReady(true);
        return;
      }

      try {
        const parsed = JSON.parse(stored) as AuthSession;
        await restoreSession(parsed);
      } catch {
        window.localStorage.removeItem(SESSION_KEY);
        setSession(null);
        setNotice('Session expired. Login again to continue.');
      } finally {
        setAuthReady(true);
      }
    })();
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language === 'mr' ? 'mr' : language === 'hi' ? 'hi' : 'en';
  }, [language]);

  useEffect(() => {
    function handleSessionExpired() {
      queryClient.clear();
      setSession(null);
      setActiveForm(null);
      setGroups([]);
      setMembers([]);
      setCurrentMandal(null);
      setExpenses([]);
      setSlips([]);
      setTasks([]);
      setTemplates([]);
      setReport(null);
      setSelectedSlip(null);
      setWorkspaceLoaded(false);
      setNotice('Session expired. Login again to continue.');
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
  }, [queryClient]);

  function startBusy(message = 'Loading') {
    setBusyMessage(message);
    setBusy(true);
  }

  function stopBusy() {
    setBusy(false);
    setBusyMessage('');
  }

  async function saveTemplateConfig(
    placements: Record<string, TemplatePlacement>,
    target?: { festivalId?: string; mandalId?: string; previewUrl?: string },
  ) {
    if (!session) throw new Error('Login is required to save template.');
    startBusy('Saving template...');
    try {
      const targetMandalId = target?.mandalId ?? mandalId;
      let targetFestivalId = target?.festivalId ?? festivalId;
      if (targetMandalId && !targetFestivalId) {
        const workspace = await apiRequest<WorkspaceBootstrap>('/workspace/bootstrap', {}, session);
        queryClient.setQueryData(workspaceQueryKey(session), workspace);
        applyWorkspaceBootstrap(workspace);
        if (workspace.kind === 'MANDAL') {
          targetFestivalId = workspace.activeForm?.festival.id;
        } else {
          const refreshedMandal = workspace.mandals.items.find((mandal) => mandal.id === targetMandalId);
          targetFestivalId = refreshedMandal?.festivals?.[0]?.id;
        }
      }
      if (!targetMandalId || !targetFestivalId) {
        throw new Error('Active mandal festival not found. Open this mandal again and try saving.');
      }

      const backgroundFileUrl = await persistTemplatePreview(targetMandalId, targetFestivalId, target?.previewUrl);

      await apiRequest(
        `/mandals/${targetMandalId}/festivals/${targetFestivalId}/templates/active-version`,
        {
          body: JSON.stringify({
            backgroundFileUrl,
            canvasHeight: 800,
            canvasWidth: 1328,
            name: 'Vargani Receipt Template',
            renderConfig: { fields: placements },
          }),
          method: 'PUT',
        },
        session,
      );

      setNotice('Template saved to backend successfully.');
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey(session) });
      await loadWorkspace(session);
    } finally {
      stopBusy();
    }
  }

  async function persistTemplatePreview(targetMandalId: string, targetFestivalId: string, previewOverride?: string) {
    const preview = previewOverride || templatePreview || TEMPLATE_IMAGE;
    if (!preview.startsWith('data:')) return resolveTemplateAssetUrl(preview);

    const asset = await apiRequest<TemplateAssetUpload>(
      `/mandals/${targetMandalId}/festivals/${targetFestivalId}/templates/assets`,
      {
        body: JSON.stringify({
          dataUrl: preview,
          fileName: `vargani-template-${Date.now()}.png`,
        }),
        method: 'POST',
      },
      session,
    );

    setTemplatePreview(asset.url);
    return asset.url;
  }

  async function createCustomField(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !session.user.mandalId || !activeForm) return;

    const form = new FormData(event.currentTarget);
    const label = String(form.get('label') || '').trim();
    const type = String(form.get('type') || 'TEXT');
    const options = String(form.get('options') || '')
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean);

    if (!label) {
      setNotice('Enter a field label before adding it.');
      return;
    }

    startBusy('Adding form question...');
    try {
      await apiRequest(
        `/mandals/${session.user.mandalId}/festivals/${activeForm.festival.id}/custom-fields`,
        {
          body: JSON.stringify({
            dashboardFilter: form.get('dashboardFilter') === 'on',
            label,
            options: type === 'DROPDOWN' ? options : undefined,
            printOnSlip: form.get('printOnSlip') === 'on',
            required: form.get('required') === 'on',
            sortOrder: (activeForm.customFields?.length ?? 0) + 1,
            type,
          }),
          method: 'POST',
        },
        session,
      );
      event.currentTarget.reset();
      setNotice('Form question added.');
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey(session) });
      await loadWorkspace(session);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add form question.');
    } finally {
      stopBusy();
    }
  }

  async function updateCustomField(field: CustomField, patch: Partial<CustomField>) {
    if (!session || !session.user.mandalId || !activeForm) return;

    startBusy('Updating form question...');
    try {
      await apiRequest(
        `/mandals/${session.user.mandalId}/festivals/${activeForm.festival.id}/custom-fields/${field.id}`,
        {
          body: JSON.stringify(patch),
          method: 'PATCH',
        },
        session,
      );
      setNotice('Form question updated.');
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey(session) });
      await loadWorkspace(session);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update form question.');
    } finally {
      stopBusy();
    }
  }

  async function deleteCustomField(field: CustomField) {
    if (!session || !session.user.mandalId || !activeForm) return;
    const confirmed = window.confirm(`Delete "${field.label}" from the vargani form? Existing slips will keep their old data.`);
    if (!confirmed) return;

    startBusy('Deleting form question...');
    try {
      await apiRequest(
        `/mandals/${session.user.mandalId}/festivals/${activeForm.festival.id}/custom-fields/${field.id}`,
        { method: 'DELETE' },
        session,
      );
      setNotice('Form question deleted.');
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey(session) });
      await loadWorkspace(session);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete form question.');
    } finally {
      stopBusy();
    }
  }

  function applyWorkspaceBootstrap(payload: WorkspaceBootstrap) {
    if (payload.kind === 'OWNER') {
      const ownerMandals = payload.mandals.items.map(mapBackendMandal);
      setActiveForm(null);
      setGroups([]);
      setMembers([]);
      setExpenses([]);
      setSlips([]);
      setTasks([]);
      setTemplates([]);
      setReport(null);
      setSelectedSlip(null);
      setDemoMandals(ownerMandals);
      setCurrentMandal(null);
      setWorkspaceLoaded(true);
      return;
    }

    const nextSlips = payload.slips.items;
    setCurrentMandal(payload.mandal ? mapBackendMandal(payload.mandal) : null);
    setActiveForm(payload.activeForm);
    setGroups(payload.groups);
    setMembers(payload.members);
    setExpenses([]);
    setSlips(nextSlips);
    setTasks([]);
    setTemplates(payload.templates);
    setReport(payload.report);
    setSelectedSlip(nextSlips[0] ?? null);
    const activeVersion = findActiveTemplateVersion(payload.templates);
    setTemplatePreview(resolveTemplateAssetUrl(activeVersion?.backgroundFileUrl || TEMPLATE_IMAGE));
    setDemoMandals([]);
    setWorkspaceLoaded(true);
  }

  function prepareWhatsAppWindow(paymentStatus: 'ACTIVE' | 'PENDING') {
    if (paymentStatus === 'PENDING') {
      whatsappWindowRef.current?.close();
      whatsappWindowRef.current = null;
      return;
    }

    whatsappWindowRef.current = window.open('about:blank', '_blank');
    if (whatsappWindowRef.current) {
      whatsappWindowRef.current.document.write('<!doctype html><title>Preparing WhatsApp</title><p style="font-family:system-ui;padding:24px">Preparing WhatsApp receipt...</p>');
      whatsappWindowRef.current.document.close();
    }
  }

  async function createReceiptShare(slip: Slip, phone?: string | null) {
    if (!session || !isSlipPaid(slip)) return null;
    return apiRequest<{ auditEventId: string; expiresAt: string; ok: boolean; receiptUrl: string; sharedAt: string }>(
      `/vargani/slips/${slip.id}/share`,
      {
        body: JSON.stringify({
          channel: 'WHATSAPP',
          phone: normalizeIndianPhone(phone ?? slip.contributorPhone),
        }),
        method: 'POST',
      },
      session,
    );
  }

  async function restoreSession(storedSession: AuthSession) {
    try {
      const profile = await apiRequest<{ user: AuthSession['user'] }>('/auth/me', {}, storedSession);
      const liveSession = { ...storedSession, user: profile.user };
      setSession(liveSession);
      setWorkspaceLoaded(false);
      await loadWorkspace(liveSession);
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
      setSession(null);
      setNotice('Session expired. Login again to continue.');
    }
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const identifier = String(form.get('identifier') || '');
    const password = String(form.get('password') || '');
    startBusy('Logging in...');
    try {
      const nextSession = await apiRequest<AuthSession>('/auth/login', {
        body: JSON.stringify({
          identifier,
          password,
        }),
        method: 'POST',
      });
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      setWorkspaceLoaded(false);
      setNotice('');
      await loadWorkspace(nextSession);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      stopBusy();
    }
  }

  async function logout() {
    if (session) await apiRequest('/auth/logout', { method: 'POST' }, session).catch(() => undefined);
    window.localStorage.removeItem(SESSION_KEY);
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    queryClient.clear();
    setSession(null);
    setActiveForm(null);
    setGroups([]);
    setMembers([]);
    setCurrentMandal(null);
    setExpenses([]);
    setSlips([]);
    setTasks([]);
    setTemplates([]);
    setReport(null);
    setSelectedSlip(null);
    setWorkspaceLoaded(false);
    setNotice('Logged out. Login again to use the console.');
    setWorkspaceRefreshing(false);
  }

  async function loadWorkspace(currentSession = session) {
    if (!currentSession) return;
    setWorkspaceRefreshing(true);
    try {
      const workspace = await apiRequest<WorkspaceBootstrap>('/workspace/bootstrap', {}, currentSession);
      queryClient.setQueryData(workspaceQueryKey(currentSession), workspace);
      applyWorkspaceBootstrap(workspace);
      if (workspace.kind === 'MANDAL' && currentSession.user.mandalId && workspace.activeForm?.festival.id) {
        const [liveExpenses, liveTasks] = await Promise.all([
          apiRequest<Expense[]>(
            `/mandals/${currentSession.user.mandalId}/festivals/${workspace.activeForm.festival.id}/expenses`,
            {},
            currentSession,
          ),
          apiRequest<FestivalTask[]>(
            `/mandals/${currentSession.user.mandalId}/festivals/${workspace.activeForm.festival.id}/tasks`,
            {},
            currentSession,
          ),
        ]);
        setExpenses(liveExpenses);
        setTasks(liveTasks);
      }
      setNotice(
        workspace.kind === 'OWNER'
          ? 'Owner workspace loaded. Manage all onboarded mandals from here.'
          : 'Live mandal data loaded from Supabase.',
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not load workspace.');
    } finally {
      setWorkspaceRefreshing(false);
    }
  }

  async function createMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !mandalId || !festivalId) return;
    const form = new FormData(event.currentTarget);
    const password = String(form.get('password') || '');
    if (!password) {
      setNotice('Password is required to create a member login.');
      return;
    }
    startBusy('Creating member login...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/members`,
        {
          body: JSON.stringify({
            areaName: String(form.get('areaName') || ''),
            email: String(form.get('email') || ''),
            groupId: String(form.get('groupId') || '') || undefined,
            name: String(form.get('name') || ''),
            password,
            phone: String(form.get('phone') || ''),
            role: 'MEMBER' satisfies UserRole,
          }),
          method: 'POST',
        },
        session,
      );
      event.currentTarget.reset();
      await loadWorkspace(session);
      setNotice('Member login created successfully.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create member login.');
    } finally {
      stopBusy();
    }
  }

  async function createMandal(event: FormEvent<HTMLFormElement>): Promise<{ id?: string; ok: boolean }> {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const logo = form.get('logo');
    const generatedPassword = generateTemporaryPassword();
    const mandalName = String(form.get('name') || '').trim();
    const contactPhone = normalizeOptionalIndianPhone(String(form.get('contactPhone') || ''));
    let logoDataUrl = '';
    const newMandal: DemoMandal = {
      additionalMembers: String(form.get('additionalMembers') || '').trim(),
      address: String(form.get('address') || '').trim(),
      adhyakshName: String(form.get('adhyakshName') || '').trim(),
      adminEmail: String(form.get('adminEmail') || `admin@${slugify(mandalName || 'mandal')}.local`).trim(),
      adminPassword: String(form.get('adminPassword') || generatedPassword),
      city: String(form.get('city') || '').trim(),
      contactEmail: String(form.get('contactEmail') || '').trim(),
      contactPhone,
      khajindarName: String(form.get('khajindarName') || '').trim(),
      logoUrl: '',
      locality: String(form.get('locality') || '').trim(),
      memberCount: String(form.get('memberCount') || '').trim(),
      name: mandalName,
    };

    if (!newMandal.name) {
      setNotice('Mandal name is required.');
      return { ok: false };
    }

    if (String(form.get('contactPhone') || '').trim() && !contactPhone) {
      setNotice('Enter phone as +919876543210 or a valid 10 digit Indian number.');
      return { ok: false };
    }

    if (session?.user.role === 'SUPER_ADMIN') {
      startBusy('Creating mandal...');
      setNotice('Creating mandal...');
      try {
        if (logo instanceof File && logo.size > 0) {
          logoDataUrl = await imageFileToCompressedDataUrl(logo);
        }

        const created = await apiRequest<{ mandal: DemoMandal }>(
          '/mandals',
          {
            body: JSON.stringify({
              address: newMandal.address || undefined,
              admin: {
                email: newMandal.adminEmail,
                name: newMandal.adhyakshName || `${newMandal.name} Admin`,
                password: newMandal.adminPassword,
                phone: contactPhone || undefined,
              },
              city: newMandal.city || undefined,
              contactName: newMandal.adhyakshName || undefined,
              contactPhone: contactPhone || undefined,
              defaultTemplateUrl: absoluteAppUrl(TEMPLATE_IMAGE),
              logoDataUrl: logoDataUrl || undefined,
              locality: newMandal.locality || undefined,
              name: newMandal.name,
              plan: 'starter',
              state: 'Maharashtra',
            }),
            method: 'POST',
          },
          session,
        );
        formElement.reset();
        await loadWorkspace(session);
        setNotice(`${newMandal.name} added. Admin password: ${newMandal.adminPassword}`);
        return { id: created.mandal.id, ok: true };
      } catch (error) {
        setNotice(error instanceof Error ? error.message : 'Could not add mandal.');
        return { ok: false };
      } finally {
        stopBusy();
      }
    }

    setNotice('Only Super Admin can add mandals.');
    return { ok: false };
  }

  async function generateSlip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const form = new FormData(event.currentTarget);
    const paymentStatus = String(form.get('paymentStatus') || 'ACTIVE') === 'PENDING' ? 'PENDING' : 'ACTIVE';
    const contributorPhone = String(form.get('contributorPhone') || '');
    if (paymentStatus === 'ACTIVE' && !whatsappWindowRef.current) {
      prepareWhatsAppWindow('ACTIVE');
    }
    const customData: Record<string, unknown> = Object.fromEntries(
      (activeForm?.customFields ?? []).map((field) => [
        field.key,
        field.type === 'CHECKBOX'
          ? form.get(`custom_${field.key}`) === 'yes'
          : String(form.get(`custom_${field.key}`) || ''),
      ]),
    );
    const tentativePaymentDate = String(form.get('tentativePaymentDate') || '');
    if (tentativePaymentDate) {
      customData.tentativePaymentDate = tentativePaymentDate;
    }
    const whatsappWindow = paymentStatus === 'ACTIVE' ? whatsappWindowRef.current : null;
    whatsappWindowRef.current = null;
    startBusy(paymentStatus === 'PENDING' ? 'Saving pending vargani...' : 'Creating vargani slip...');
    try {
      const slip = await apiRequest<Slip>(
        '/vargani/slips',
        {
          body: JSON.stringify({
            amount: Number(form.get('amount')),
            areaName: String(form.get('areaName')),
            contributorAddress: String(form.get('contributorAddress')),
            contributorName: String(form.get('contributorName')),
            contributorPhone,
            customData,
            groupId: String(form.get('groupId') || '') || undefined,
            idempotencyKey: crypto.randomUUID(),
            paymentMode: String(form.get('paymentMode')) as PaymentMode,
            shopName: String(form.get('shopName')),
            status: paymentStatus,
          }),
          method: 'POST',
        },
        session,
      );
      setSlips((current) => [slip, ...current]);
      setSelectedSlip(slip);
      event.currentTarget.reset();
      await loadWorkspace(session);
      if (paymentStatus === 'PENDING') {
        whatsappWindow?.close();
        setNotice(`Pending vargani entry ${slip.slipNumber} saved.`);
      } else {
        const share = await createReceiptShare(slip, contributorPhone);
        await shareReceiptToWhatsApp(slip, contributorPhone, whatsappWindow, share?.receiptUrl);
        setNotice(`Slip ${slip.slipNumber} generated. WhatsApp opened and receipt message copied.`);
      }
    } catch (error) {
      whatsappWindow?.close();
      setNotice(error instanceof Error ? error.message : 'Could not generate slip.');
    } finally {
      stopBusy();
    }
  }

  async function downloadSlipAsJpeg(slip: Slip) {
    startBusy('Preparing slip image...');
    try {
      let placements: Record<string, TemplatePlacement> =
        normalizeTemplatePlacements(latestTemplateVersion?.renderConfig?.fields);
      let bgUrl = resolveTemplateAssetUrl(latestTemplateVersion?.backgroundFileUrl || templatePreview || TEMPLATE_IMAGE);

      if (Object.keys(placements).length === 0) {
        placements = {
          amount: { ...defaultPlacement(), color: '#111111', fontSize: 31, fontWeight: 900, height: 52, textAlign: 'left', width: 250, x: 720, y: 680 },
          building_name: { ...defaultPlacement(), color: '#111111', fontSize: 24, fontWeight: 700, height: 48, textAlign: 'left', width: 420, x: 715, y: 623 },
          contributorAddress: { ...defaultPlacement(), color: '#111111', fontSize: 27, fontWeight: 800, height: 70, textAlign: 'left', textWrap: 'wrap', width: 560, x: 715, y: 574 },
          contributorName: { ...defaultPlacement(), color: '#111111', fontSize: 30, fontWeight: 900, height: 58, textAlign: 'left', width: 610, x: 670, y: 515 },
          createdAt: { ...defaultPlacement(), color: '#111111', fontSize: 25, fontWeight: 800, height: 46, textAlign: 'center', width: 160, x: 1115, y: 455 },
          slipNumber: { ...defaultPlacement(), color: '#b62028', fontSize: 31, fontWeight: 900, height: 48, textAlign: 'left', width: 100, x: 648, y: 445 },
        };
      }

      const canvasWidth = latestTemplateVersion?.canvasWidth ?? 1328;
      const canvasHeight = latestTemplateVersion?.canvasHeight ?? 800;
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas rendering context unavailable');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not load slip background image'));
        img.src = bgUrl;
      });

      drawContainedImage(ctx, img, canvasWidth, canvasHeight);

      const d = new Date(slip.createdAt);
      const formattedDate = !isNaN(d.getTime())
        ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
        : slip.createdAt ? slip.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10);

      const rawAmount = Number(slip.amount);
      const formattedAmount = !isNaN(rawAmount) ? rawAmount.toLocaleString('en-IN') : String(slip.amount || '0');

      const values: Record<string, string> = {
        amount: formattedAmount,
        amountWords: amountToIndianWords(rawAmount),
        amountWordsMarathi: amountToMarathiWords(rawAmount),
        building_name: slip.customData?.building_name || sampleFieldValue('building_name', 'Building / Lane'),
        contributorAddress: slip.contributorAddress || sampleFieldValue('contributorAddress', 'Address'),
        contributorName: slip.contributorName || sampleFieldValue('contributorName', 'Name'),
        contributorPhone: slip.contributorPhone || sampleFieldValue('contributorPhone', 'Mobile No.'),
        createdAt: formattedDate,
        paymentMode: slip.paymentMode || 'CASH',
        shopName: slip.shopName || '',
        slipNumber: slip.slipNumber || '001',
        areaName: slip.areaName || '',
        collectorName: session?.user.name || 'Collector',
      };

      Object.entries(placements).forEach(([key, p]) => {
        const baseKey = baseTemplateFieldKey(key);
        let text = values[baseKey] ?? slip.customData?.[baseKey] ?? sampleFieldValue(baseKey, baseKey);
        if (!text) return;

        if (baseKey === 'slipNumber' && p.width < 150 && text.includes('-')) {
          const parts = text.split('-');
          const lastPart = parts[parts.length - 1];
          text = lastPart.length > 3 ? lastPart.slice(-3) : lastPart;
        }

        const renderText = transformTemplateText(text, p);
        ctx.save();
        ctx.globalAlpha = p.opacity ?? 1;
        const fontStyle = p.fontStyle === 'italic' ? 'italic ' : '';
        const fontWeight = p.fontWeight || 700;
        let fontSize = p.fontSize || 24;
        const fontFamily = p.fontFamily || '"Noto Sans Devanagari", Arial, sans-serif';

        if (p.textWrap === 'shrink' && renderText.length > 18) {
          fontSize = Math.max(10, fontSize - Math.ceil((renderText.length - 18) / 3));
        }

        ctx.font = `${fontStyle}${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = p.color || '#111111';
        ctx.translate(p.x + p.width / 2, p.y + p.height / 2);
        ctx.rotate(((p.rotate || 0) * Math.PI) / 180);
        const localX = -p.width / 2;
        const localY = -p.height / 2;

        if (shouldPrintFieldBackground(p.backgroundColor)) {
          ctx.fillStyle = p.backgroundColor;
          ctx.fillRect(localX, localY, p.width, p.height);
          ctx.fillStyle = p.color || '#111111';
        }

        if (shouldPrintFieldBorder(p.borderColor)) {
          ctx.strokeStyle = p.borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(localX, localY, p.width, p.height);
        }

        ctx.beginPath();
        ctx.rect(localX, localY, p.width, p.height);
        ctx.clip();

        ctx.textAlign = p.textAlign || 'left';
        let textX = localX + (p.padding || 0);
        if (p.textAlign === 'center') {
          textX = 0;
        } else if (p.textAlign === 'right') {
          textX = localX + p.width - (p.padding || 0);
        }

        const isSingleLine = (p.textWrap ?? 'single') !== 'wrap';
        let textY: number;

        if (isSingleLine) {
          ctx.textBaseline = 'middle';
          textY = 0;
        } else {
          ctx.textBaseline = 'top';
          textY = localY + (p.padding || 4);
        }

        if (p.shadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        if (isSingleLine) {
          drawCanvasText(ctx, renderText, textX, textY, p.letterSpacing || 0);
        } else {
          drawWrappedCanvasText(ctx, renderText, textX, textY, p.width, p.height, fontSize, p.lineHeight || 1.15, p.letterSpacing || 0);
        }
        ctx.restore();
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          setNotice('Could not generate JPEG slip image.');
          stopBusy();
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Slip_${slip.slipNumber || slip.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setNotice(`Slip ${slip.slipNumber} downloaded as JPEG image.`);
        stopBusy();
      }, 'image/jpeg', 0.95);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not download slip image');
      stopBusy();
    }
  }

  async function shareSlip(slip: Slip) {
    if (!isSlipPaid(slip)) {
      setNotice('Receipt can be shared only after payment is received.');
      return;
    }
    startBusy('Opening WhatsApp receipt...');
    try {
      const whatsappWindow = window.open('about:blank', '_blank');
      const share = await createReceiptShare(slip, slip.contributorPhone);
      await shareReceiptToWhatsApp(slip, slip.contributorPhone, whatsappWindow, share?.receiptUrl);
      setNotice(`Slip ${slip.slipNumber} WhatsApp message copied and opened.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not share receipt.');
    } finally {
      stopBusy();
    }
  }

  async function createExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !mandalId || !festivalId) return;
    const form = new FormData(event.currentTarget);
    const description = String(form.get('description') || '').trim();
    const category = String(form.get('category') || '').trim();
    startBusy('Saving expense...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/expenses`,
        {
          body: JSON.stringify({
            amount: Number(form.get('amount') || 0),
            expenseDate: String(form.get('date') || new Date().toISOString().slice(0, 10)),
            notes: category ? `${description}\nCategory: ${category}` : description,
            status: 'APPROVED',
            vendorName: String(form.get('vendor') || ''),
          }),
          method: 'POST',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Expense saved to backend.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save expense.');
    } finally {
      stopBusy();
    }
  }

  async function updateExpense(expense: Expense) {
    if (!session || !mandalId || !festivalId) return;
    const amount = window.prompt('Expense amount', String(expense.amount));
    if (amount === null) return;
    const vendorName = window.prompt('Vendor name', expense.vendorName ?? '') ?? expense.vendorName ?? '';
    startBusy('Updating expense...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/expenses/${expense.id}`,
        {
          body: JSON.stringify({
            amount: Number(amount),
            expenseDate: expense.expenseDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
            notes: expense.notes,
            status: expense.status,
            vendorName,
          }),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Expense updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update expense.');
    } finally {
      stopBusy();
    }
  }

  async function deleteExpense(expense: Expense) {
    if (!session || !mandalId || !festivalId || !window.confirm('Delete this expense permanently?')) return;
    startBusy('Deleting expense...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/expenses/${expense.id}`,
        { method: 'DELETE' },
        session,
      );
      await loadWorkspace(session);
      setNotice('Expense deleted.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete expense.');
    } finally {
      stopBusy();
    }
  }

  function taskPayloadFromForm(form: FormData): Partial<FestivalTask> {
    return {
      assigneeUserId: String(form.get('assigneeUserId') || '') || undefined,
      dueDate: String(form.get('dueDate') || '') || undefined,
      groupId: String(form.get('groupId') || '') || undefined,
      notes: String(form.get('notes') || '').trim() || undefined,
      priority: String(form.get('priority') || 'MEDIUM') as TaskPriority,
      status: String(form.get('status') || 'OPEN') as TaskStatus,
      title: String(form.get('title') || '').trim(),
    };
  }

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !mandalId || !festivalId) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    if (!name) return;
    startBusy('Creating group...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/groups`,
        {
          body: JSON.stringify({
            areaName: String(form.get('areaName') || '').trim() || undefined,
            leaderUserId: String(form.get('leaderUserId') || '') || undefined,
            name,
          }),
          method: 'POST',
        },
        session,
      );
      event.currentTarget.reset();
      await loadWorkspace(session);
      setNotice('Group created.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create group.');
    } finally {
      stopBusy();
    }
  }

  async function updateGroup(groupId: string, patch: { areaName?: string | null; leaderUserId?: string | null; name?: string }) {
    if (!session || !mandalId || !festivalId) return;
    startBusy('Saving group...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/groups/${groupId}`,
        {
          body: JSON.stringify(patch),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Group updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update group.');
    } finally {
      stopBusy();
    }
  }

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !mandalId || !festivalId) return;
    const payload = taskPayloadFromForm(new FormData(event.currentTarget));
    if (!payload.title) return;
    startBusy('Creating task...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/tasks`,
        {
          body: JSON.stringify(payload),
          method: 'POST',
        },
        session,
      );
      event.currentTarget.reset();
      await loadWorkspace(session);
      setNotice('Task added.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not add task.');
    } finally {
      stopBusy();
    }
  }

  async function updateTask(task: FestivalTask, patch?: Partial<FestivalTask> | FormEvent<HTMLFormElement>) {
    if (!session || !mandalId || !festivalId) return;
    const isFormEvent = patch && 'currentTarget' in patch;
    if (isFormEvent) patch.preventDefault();
    const nextPatch: Partial<FestivalTask> = isFormEvent
      ? taskPayloadFromForm(new FormData(patch.currentTarget))
      : patch ?? {};
    const title = nextPatch?.title ?? task.title;
    if (!title?.trim()) return;
    startBusy('Updating task...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/tasks/${task.id}`,
        {
          body: JSON.stringify({
            assigneeUserId: nextPatch?.assigneeUserId ?? task.assigneeUserId ?? undefined,
            dueDate: nextPatch?.dueDate ?? task.dueDate ?? undefined,
            groupId: nextPatch?.groupId ?? task.groupId ?? undefined,
            notes: nextPatch?.notes ?? task.notes ?? undefined,
            priority: nextPatch?.priority ?? task.priority,
            status: nextPatch?.status ?? task.status,
            title,
          }),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Task updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update task.');
    } finally {
      stopBusy();
    }
  }

  async function deleteTask(task: FestivalTask) {
    if (!session || !mandalId || !festivalId || !window.confirm('Delete this task?')) return;
    startBusy('Deleting task...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/tasks/${task.id}`,
        { method: 'DELETE' },
        session,
      );
      await loadWorkspace(session);
      setNotice('Task deleted.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not delete task.');
    } finally {
      stopBusy();
    }
  }

  async function updateMember(member: Member) {
    if (!session || !mandalId || !festivalId) return;
    const name = window.prompt('Member name', member.displayName);
    if (!name?.trim()) return;
    const phone = window.prompt('Phone number', member.phone ?? member.user?.phone ?? '') ?? member.phone ?? member.user?.phone ?? '';
    const areaName = window.prompt('Area', member.areaName ?? '') ?? member.areaName ?? '';
    startBusy('Updating member...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/members/${member.id}`,
        {
          body: JSON.stringify({ areaName, name: name.trim(), phone, role: member.user?.role ?? 'MEMBER' }),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Member updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member.');
    } finally {
      stopBusy();
    }
  }

  async function assignMemberGroup(member: Member, groupId: string) {
    if (!session || !mandalId || !festivalId) return;
    const userId = getMemberUserId(member);
    const isOrphanLeader = member.user?.role === 'GROUP_LEADER' && !groups.some((group) => group.leader?.id === userId);
    startBusy('Assigning group...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/members/${member.id}`,
        {
          body: JSON.stringify({
            areaName: member.areaName ?? '',
            groupId: groupId || null,
            name: member.displayName,
            phone: member.phone ?? member.user?.phone ?? '',
            role: isOrphanLeader ? 'MEMBER' : member.user?.role ?? 'MEMBER',
          }),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice(isOrphanLeader ? 'Member assigned to group and old orphan leader role cleaned.' : 'Member group updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update member group.');
    } finally {
      stopBusy();
    }
  }

  async function archiveMember(member: Member) {
    if (!session || !mandalId || !festivalId || !window.confirm(`Archive ${member.displayName}?`)) return;
    startBusy('Archiving member...');
    try {
      await apiRequest(
        `/mandals/${mandalId}/festivals/${festivalId}/members/${member.id}`,
        { method: 'DELETE' },
        session,
      );
      await loadWorkspace(session);
      setNotice('Member archived.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not archive member.');
    } finally {
      stopBusy();
    }
  }

  function remindMember(member: Member) {
    const phone = normalizeIndianPhone(member.phone ?? member.user?.phone);
    if (!phone) {
      setNotice('Member phone number is missing.');
      return;
    }
    const message = encodeURIComponent(`Namaskar ${member.displayName}, please complete your Digital Vargani collection update for ${activeForm?.festival.name ?? 'the festival'}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    setNotice(`WhatsApp reminder opened for ${member.displayName}.`);
  }

  async function updateSlip(slip: Slip) {
    if (!session) return;
    const amount = window.prompt('Slip amount', String(slip.amount));
    if (amount === null) return;
    const contributorName = window.prompt('Contributor name', slip.contributorName) ?? slip.contributorName;
    const statusInput = window.prompt('Status: ACTIVE or PENDING', isSlipPaid(slip) ? 'ACTIVE' : 'PENDING')?.toUpperCase();
    const status = statusInput === 'PENDING' ? 'PENDING' : 'ACTIVE';
    startBusy('Updating slip...');
    try {
      await apiRequest(
        `/vargani/slips/${slip.id}`,
        {
          body: JSON.stringify({
            amount: Number(amount),
            areaName: slip.areaName,
            contributorAddress: slip.contributorAddress,
            contributorName,
            contributorPhone: slip.contributorPhone,
            customData: slip.customData ?? {},
            paymentMode: slip.paymentMode,
            shopName: slip.shopName,
            status,
          }),
          method: 'PATCH',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Slip updated.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not update slip.');
    } finally {
      stopBusy();
    }
  }

  async function cancelSlip(slip: Slip) {
    if (!session || !window.confirm(`Cancel slip ${slip.slipNumber}?`)) return;
    startBusy('Cancelling slip...');
    try {
      await apiRequest(
        `/vargani/slips/${slip.id}/cancel`,
        {
          body: JSON.stringify({ reason: 'Cancelled from Adhyaksh console' }),
          method: 'POST',
        },
        session,
      );
      await loadWorkspace(session);
      setNotice('Slip cancelled.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not cancel slip.');
    } finally {
      stopBusy();
    }
  }

  const overlayMessage = busy
    ? busyMessage || 'Working...'
    : workspaceRefreshing && workspaceLoaded
    ? 'Refreshing workspace...'
    : '';
  const withActionOverlay = (content: ReactNode) => (
    <>
      {content}
      {overlayMessage && <ActionLoaderOverlay message={overlayMessage} />}
    </>
  );

  if (!authReady) {
    return <AuthLoadingScreen detail="Checking saved login..." />;
  }

  if (session && !workspaceLoaded && workspaceRefreshing) {
    return <AuthLoadingScreen detail="Opening your workspace..." />;
  }

  const isCollectorRole = session?.user.role === 'MEMBER' || session?.user.role === 'GROUP_LEADER';

  if (isCollectorRole) {
    return withActionOverlay(
      <MemberCollectorApp
        activeForm={activeForm}
        busy={busy}
        modalOpen={collectorModalOpen}
        notice={notice}
        onDownloadSlip={downloadSlipAsJpeg}
        onGenerate={generateSlip}
        onLogout={logout}
        onModalChange={setCollectorModalOpen}
        onPrepareWhatsApp={prepareWhatsAppWindow}
        onShareSlip={shareSlip}
        mandal={currentMandal}
        session={session}
        setSelectedSlip={setSelectedSlip}
        slips={slips}
      />,
    );
  }

  if (!session) {
    return withActionOverlay(<LoginPanel onSubmit={login} busy={busy} notice={notice} />);
  }

  if (session.user.role === 'SUPER_ADMIN') {
    return withActionOverlay(
      <SuperAdminApp
        busy={busy}
        demoMandals={demoMandals}
        language={language}
        notice={notice}
        onCreateMandal={createMandal}
        onLanguageChange={setLanguage}
        onLogout={logout}
        onTemplateSaved={saveTemplateConfig}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        session={session}
        onPreviewChange={handlePreviewChange}
      />,
    );
  }

  return withActionOverlay(
    <AdhyakshApp
      activeForm={activeForm}
      busy={busy}
      expenses={expenses}
      groups={groups}
      members={members}
      mandal={currentMandal}
      notice={notice}
      onArchiveMember={archiveMember}
      onAssignMemberGroup={assignMemberGroup}
      onCancelSlip={cancelSlip}
      onCreateMember={createMember}
      onCreateExpense={createExpense}
      onCreateGroup={createGroup}
      onCreateCustomField={createCustomField}
      onCreateTask={createTask}
      onDeleteCustomField={deleteCustomField}
      onDeleteExpense={deleteExpense}
      onDeleteTask={deleteTask}
      onDownloadSlip={downloadSlipAsJpeg}
      onEditExpense={updateExpense}
      onEditMember={updateMember}
      onEditSlip={updateSlip}
      onEditTask={(task, event) => updateTask(task, event)}
      onGenerate={generateSlip}
      onLogout={logout}
      onRemindMember={remindMember}
      onRefresh={() => loadWorkspace()}
      onShareSlip={shareSlip}
      onTemplateSaved={(placements) => saveTemplateConfig(placements)}
      onTaskDone={(task) => updateTask(task, { status: 'DONE' })}
      onUpdateCustomField={updateCustomField}
      onUpdateGroup={updateGroup}
      query={query}
      report={report}
      session={session}
      setQuery={setQuery}
      setSelectedSlip={setSelectedSlip}
      setSidebarOpen={setSidebarOpen}
      sidebarOpen={sidebarOpen}
      slips={filteredSlips}
      tasks={tasks}
      workspaceRefreshing={workspaceRefreshing}
      activeTemplate={activeTemplate}
      latestTemplateVersion={latestTemplateVersion}
      onPreviewChange={handlePreviewChange}
      onPrepareWhatsApp={prepareWhatsAppWindow}
      templatePreview={templatePreview}
      workspaceLoaded={workspaceLoaded}
    />,
  );
}

const adhyakshNavItems: Array<{ id: AdhyakshScreen; icon: ReactNode; label: string }> = [
  { id: 'members', icon: <UsersRound size={20} />, label: 'Members & Vargani' },
  { id: 'tasks', icon: <ShieldCheck size={20} />, label: 'Tasks' },
  { id: 'expenses', icon: <WalletCards size={20} />, label: 'Expenses' },
  { id: 'template', icon: <FileText size={20} />, label: 'Vargani Template' },
  { id: 'slips', icon: <BadgeIndianRupee size={20} />, label: 'Vargani Slips' },
  { id: 'form', icon: <SlidersHorizontal size={20} />, label: 'Form Management' },
  { id: 'users', icon: <UserCog size={20} />, label: 'User Management' },
  { id: 'logs', icon: <ClipboardList size={20} />, label: 'System Logs' },
];

const adhyakshScreenIds = adhyakshNavItems.map((item) => item.id);

function cleanHash(hash = window.location.hash) {
  return hash.replace(/^#\/?/, '');
}

function parseAdhyakshRoute(hash = window.location.hash): AdhyakshScreen | null {
  const route = cleanHash(hash);
  const screen = route.startsWith('mandal/') ? route.slice('mandal/'.length) : route;
  return adhyakshScreenIds.includes(screen as AdhyakshScreen) ? (screen as AdhyakshScreen) : null;
}

function parseOwnerRoute(hash = window.location.hash) {
  const route = cleanHash(hash);
  if (route === 'owner/mandals/new') {
    return {
      isNew: true,
      mandalId: null,
      screen: 'mandals' as OwnerScreen,
      tab: 'overview' as OwnerMandalTab,
    };
  }

  const [, screen, mandalId, tab] = route.match(/^owner\/(dashboard|mandals)(?:\/([^/]+))?(?:\/(overview|template))?$/) ?? [];
  if (!screen) return null;
  return {
    isNew: false,
    mandalId: mandalId ? decodeURIComponent(mandalId) : null,
    screen: screen as OwnerScreen,
    tab: (tab as OwnerMandalTab | undefined) ?? 'overview',
  };
}

function isMemberRoute(hash = window.location.hash) {
  return cleanHash(hash) === 'member/slips';
}

function routeForLogin(type: 'mandal' | 'owner') {
  return type === 'owner' ? '#/super-admin/login' : '#/login';
}

function routeForAdhyaksh(screen: AdhyakshScreen) {
  return `#/mandal/${screen}`;
}

function routeForOwner(screen: OwnerScreen, mandalId?: string | null, tab: OwnerMandalTab = 'overview') {
  if (screen === 'dashboard') return '#/owner/dashboard';
  if (mandalId) return `#/owner/mandals/${encodeURIComponent(mandalId)}/${tab}`;
  return '#/owner/mandals';
}

function routeForNewMandal() {
  return '#/owner/mandals/new';
}

function routeForMember() {
  return '#/member/slips';
}

function writeRoute(nextHash: string, mode: 'push' | 'replace' = 'push') {
  if (window.location.hash === nextHash) return;
  const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
  if (mode === 'replace') {
    window.history.replaceState(null, '', nextUrl);
    return;
  }
  window.history.pushState(null, '', nextUrl);
}

function AuthLoadingScreen({ detail = 'Opening your workspace...' }: { detail?: string }) {
  return (
    <main className="loading-screen">
      <LoadingCard detail={detail} />
    </main>
  );
}

function ActionLoaderOverlay({ message }: { message: string }) {
  return (
    <div aria-live="polite" className="action-loader-overlay" role="status">
      <LoadingCard detail={message} compact />
    </div>
  );
}

function LoadingCard({ compact = false, detail }: { compact?: boolean; detail: string }) {
  return (
    <section className={`loading-card ${compact ? 'compact' : ''}`}>
      <PenWritingLoader />
      <div className="loading-copy">
        <strong>Loading</strong>
        <span>{detail}</span>
      </div>
    </section>
  );
}

function PenWritingLoader() {
  return (
    <div aria-hidden="true" className="pen-loader">
      <svg viewBox="0 0 220 118" role="img">
        <path className="pen-line line-one" d="M30 82 C58 50 82 104 112 70 S160 58 190 80" />
        <path className="pen-line line-two" d="M42 96 C82 82 118 102 178 92" />
        <g className="pen-body">
          <path d="M130 30 L177 77 L166 88 L119 41 Z" />
          <path d="M111 49 L119 41 L166 88 L158 96 Z" />
          <path d="M105 55 L111 49 L158 96 L145 101 Z" />
          <circle cx="154" cy="53" r="4" />
        </g>
      </svg>
    </div>
  );
}

function AdhyakshApp({
  activeTemplate,
  activeForm,
  busy,
  expenses,
  groups,
  latestTemplateVersion,
  mandal,
  members,
  notice,
  onArchiveMember,
  onAssignMemberGroup,
  onCancelSlip,
  onCreateMember,
  onCreateExpense,
  onCreateGroup,
  onCreateCustomField,
  onCreateTask,
  onDeleteCustomField,
  onDeleteExpense,
  onDeleteTask,
  onDownloadSlip,
  onEditExpense,
  onEditMember,
  onEditSlip,
  onEditTask,
  onGenerate,
  onLogout,
  onPreviewChange,
  onPrepareWhatsApp,
  onRemindMember,
  onRefresh,
  onShareSlip,
  onTemplateSaved,
  onTaskDone,
  onUpdateCustomField,
  onUpdateGroup,
  query,
  report,
  session,
  setQuery,
  setSelectedSlip,
  setSidebarOpen,
  sidebarOpen,
  slips,
  tasks,
  templatePreview,
  workspaceLoaded,
  workspaceRefreshing,
}: {
  activeTemplate?: Template;
  activeForm: ActiveForm | null;
  busy: boolean;
  expenses: Expense[];
  groups: Group[];
  latestTemplateVersion?: Template['versions'][number];
  mandal: DemoMandal | null;
  members: Member[];
  notice: string;
  onArchiveMember: (member: Member) => Promise<void> | void;
  onAssignMemberGroup: (member: Member, groupId: string) => Promise<void> | void;
  onCancelSlip: (slip: Slip) => Promise<void> | void;
  onCreateMember: (event: FormEvent<HTMLFormElement>) => void;
  onCreateExpense: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onCreateGroup: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onCreateCustomField: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onCreateTask: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onDeleteCustomField: (field: CustomField) => Promise<void> | void;
  onDeleteExpense: (expense: Expense) => Promise<void> | void;
  onDeleteTask: (task: FestivalTask) => Promise<void> | void;
  onDownloadSlip: (slip: Slip) => Promise<void>;
  onEditExpense: (expense: Expense) => Promise<void> | void;
  onEditMember: (member: Member) => Promise<void> | void;
  onEditSlip: (slip: Slip) => Promise<void> | void;
  onEditTask: (task: FestivalTask, event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onGenerate: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onLogout: () => void;
  onPreviewChange: (url: string) => void;
  onPrepareWhatsApp: (paymentStatus: 'ACTIVE' | 'PENDING') => void;
  onRemindMember: (member: Member) => void;
  onRefresh: () => void;
  onShareSlip: (slip: Slip) => Promise<void>;
  onTemplateSaved: (placements: Record<string, TemplatePlacement>) => Promise<void> | void;
  onTaskDone: (task: FestivalTask) => Promise<void> | void;
  onUpdateCustomField: (field: CustomField, patch: Partial<CustomField>) => Promise<void> | void;
  onUpdateGroup: (groupId: string, patch: { areaName?: string | null; leaderUserId?: string | null; name?: string }) => Promise<void> | void;
  query: string;
  report: CollectionReport | null;
  session: AuthSession;
  setQuery: (value: string) => void;
  setSelectedSlip: (slip: Slip) => void;
  setSidebarOpen: (value: boolean | ((open: boolean) => boolean)) => void;
  sidebarOpen: boolean;
  slips: Slip[];
  tasks: FestivalTask[];
  templatePreview: string;
  workspaceLoaded: boolean;
  workspaceRefreshing: boolean;
}) {
  const [screen, setScreen] = useState<AdhyakshScreen>(() => parseAdhyakshRoute() ?? 'members');
  const [entryOpen, setEntryOpen] = useState(false);
  const [entryStatus, setEntryStatus] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [memberOpen, setMemberOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FestivalTask | null>(null);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [localNotice, setLocalNotice] = useState('');
  const [slipFilter, setSlipFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const mandalIdentity = getMandalIdentity(mandal, session);
  const slipRows = slips;
  const paidSlipRows = slipRows.filter(isSlipPaid);
  const pendingSlipRows = slipRows.filter((slip) => !isSlipPaid(slip));
  const filteredSlipRows =
    slipFilter === 'paid' ? paidSlipRows : slipFilter === 'pending' ? pendingSlipRows : slipRows;
  const totalSlipCollection = paidSlipRows.reduce((sum, slip) => sum + Number(slip.amount || 0), 0);
  const memberUserId = getMemberUserId;
  const collectionByUser = new Map<string, number>();
  const collectionByGroup = new Map<string, number>();
  paidSlipRows.forEach((slip) => {
    const amount = Number(slip.amount || 0);
    if (slip.collectedByUserId) {
      collectionByUser.set(slip.collectedByUserId, (collectionByUser.get(slip.collectedByUserId) ?? 0) + amount);
    }
    if (slip.groupId) {
      collectionByGroup.set(slip.groupId, (collectionByGroup.get(slip.groupId) ?? 0) + amount);
    }
  });
  const memberRows = members.map((member) => {
    const phone = member.phone ?? member.user?.phone ?? '';
    const memberSlips = slipRows.filter((slip) => phone && normalizeIndianPhone(slip.contributorPhone) === normalizeIndianPhone(phone));
    const vargani = memberSlips.filter(isSlipPaid).reduce((sum, slip) => sum + Number(slip.amount || 0), 0);
    const userId = memberUserId(member);
    const ledGroup = groups.find((group) => group.leader?.id === userId);
    const isLeader = Boolean(ledGroup);
    const isOrphanLeader = member.user?.role === 'GROUP_LEADER' && !ledGroup;
    return {
      collected: Number(member.collectionTotal ?? collectionByUser.get(userId) ?? 0),
      contact: phone || '-',
      groupName: member.group?.name ?? (isOrphanLeader ? 'Needs group assignment' : 'No group'),
      isLeader,
      isOrphanLeader,
      member,
      name: member.displayName,
      paidSlipCount: Number(member.paidSlipCount ?? 0),
      paid: vargani > 0,
      rawGroupId: member.group?.id ?? member.groupId ?? '',
      role: member.user?.role.replaceAll('_', ' ') ?? 'Member',
      vargani,
    };
  });
  const memberRowsByGroup = new Map<string, typeof memberRows>();
  memberRows.forEach((row) => {
    const groupId = row.member.group?.id ?? row.member.groupId;
    if (!groupId) return;
    memberRowsByGroup.set(groupId, [...(memberRowsByGroup.get(groupId) ?? []), row]);
  });
  const groupsWithStats = groups.map((group) => {
    const rows = memberRowsByGroup.get(group.id) ?? [];
    const leaderRow = group.leader?.id ? memberRows.find((row) => memberUserId(row.member) === group.leader?.id) : undefined;
    const memberRowsForGroup = leaderRow && !rows.some((row) => row.member.id === leaderRow.member.id) ? [leaderRow, ...rows] : rows;
    return {
      ...group,
      collected: Number(group.collectionTotal ?? collectionByGroup.get(group.id) ?? 0),
      memberRows: memberRowsForGroup,
      memberCount: memberRowsForGroup.length || group._count?.members || group.members?.length || 0,
      slipCount: Number(group.paidSlipCount ?? group._count?.slips ?? 0),
    };
  });
  const memberVargani = memberRows.filter((member) => member.paid).reduce((sum, member) => sum + member.vargani, 0);
  const pendingMemberVargani = memberRows.filter((member) => !member.paid).reduce((sum, member) => sum + member.vargani, 0);
  const expensesTotal = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const balance = Number(report?.balance ?? totalSlipCollection + memberVargani - expensesTotal);
  const isInitialSync = workspaceRefreshing && !workspaceLoaded;
  const displayNotice = localNotice || (notice && /error|failed|expired|could not|logged out|unauthorized/i.test(notice) ? notice : '');
  const metricValue = (value: string) => (workspaceLoaded ? value : '--');
  const metricNote = (note: string) => (workspaceLoaded ? note : 'Loading live data');
  const userRows = [
    {
      email: 'current-login',
      entries: slipRows.length,
      joined: 'Active now',
      member: undefined as Member | undefined,
      name: session.user.name,
      role: session.user.role.replaceAll('_', ' '),
    },
    ...members.map((member) => ({
      email: member.user?.email ?? '-',
      entries: slipRows.filter((slip) => slip.contributorPhone && slip.contributorPhone === (member.phone ?? member.user?.phone)).length,
      joined: 'Live member',
      member,
      name: member.displayName,
      role: member.user?.role.replaceAll('_', ' ') ?? 'MEMBER',
    })),
  ];

  function showToast(message: string) {
    setLocalNotice(message);
    window.setTimeout(() => setLocalNotice(''), 2800);
  }

  async function saveTemplate(placements: Record<string, TemplatePlacement>) {
    await onTemplateSaved(placements);
    showToast('Template saved successfully.');
  }

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function openScreen(nextScreen: AdhyakshScreen) {
    setScreen(nextScreen);
    writeRoute(routeForAdhyaksh(nextScreen));
    closeSidebar();
  }

  useEffect(() => {
    if (!parseAdhyakshRoute()) {
      writeRoute(routeForAdhyaksh(screen), 'replace');
    }

    function syncScreenFromRoute() {
      const nextScreen = parseAdhyakshRoute();
      if (nextScreen) setScreen(nextScreen);
    }

    window.addEventListener('hashchange', syncScreenFromRoute);
    window.addEventListener('popstate', syncScreenFromRoute);
    return () => {
      window.removeEventListener('hashchange', syncScreenFromRoute);
      window.removeEventListener('popstate', syncScreenFromRoute);
    };
  }, [screen]);

  function pageTitle() {
    return {
      expenses: 'Expenses',
      form: 'Form Management',
      logs: 'Logs',
      members: 'Members',
      slips: 'Vargani Slips',
      tasks: 'Tasks',
      template: 'Vargani Template',
      users: 'User Management',
    }[screen];
  }

  return (
    <main className={`member-shell adhyaksh-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <div className="mobile-workspace-bar">
        <div className="mobile-workspace-brand">
          {mandalIdentity.logoUrl ? <img alt="" src={mandalIdentity.logoUrl} /> : <span>{mandalIdentity.initials}</span>}
          <div>
            <strong>{mandalIdentity.name}</strong>
            <small>{mandalIdentity.location}</small>
          </div>
        </div>
        <button className="mobile-menu-toggle" onClick={() => setSidebarOpen((open) => !open)} type="button">
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {sidebarOpen && <button aria-label="Close menu" className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} type="button" />}
      <aside className="member-sidebar adhyaksh-sidebar">
        <div className="mandal-identity">
          {mandalIdentity.logoUrl ? <img alt="" className="mandal-avatar-img" src={mandalIdentity.logoUrl} /> : <span className="mandal-seal">{mandalIdentity.initials}</span>}
          <div>
            <strong>{mandalIdentity.name}</strong>
            <small>{mandalIdentity.location}</small>
          </div>
        </div>
        <div className="mandal-contact-card">
          <span>{mandalIdentity.address}</span>
          <span>{mandalIdentity.phone}</span>
        </div>
        <nav className="adhyaksh-nav">
          {adhyakshNavItems.map((item) => (
            <button
              className={screen === item.id ? 'active' : ''}
              key={item.id}
              onClick={() => openScreen(item.id)}
              type="button"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout" onClick={() => { closeSidebar(); onLogout(); }} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <section className="member-content adhyaksh-content">
        <header className="adhyaksh-header">
          <h1>{pageTitle()}</h1>
          <div className="adhyaksh-header-actions">
            <button disabled={busy || workspaceRefreshing} onClick={onRefresh} type="button"><RefreshCw size={17} className={workspaceRefreshing ? 'spin-icon' : ''} />{workspaceRefreshing ? 'Syncing' : 'Refresh'}</button>
            <label className="year-select">
              <span>Active Year</span>
              <select defaultValue="2026"><option>Year 2026</option><option>Year 2027</option></select>
            </label>
            <div className="top-user mini">
              <span>{session.user.name.charAt(0)}</span>
              <div>
                <strong title={session.user.name}>{session.user.name}</strong>
                <small>{session.user.role.replaceAll('_', ' ')}</small>
              </div>
            </div>
          </div>
        </header>
        {displayNotice && <div className={`notice show ${busy ? 'busy' : ''}`}>{displayNotice}</div>}

        {screen === 'members' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div>
                <h2>Member Directory (2026)</h2>
                <span>Track member vargani commitments and payment status.</span>
              </div>
              <button className="blue-action" onClick={() => setMemberOpen(true)} type="button"><Plus size={18} />Add Member</button>
            </div>
            <div className="metric-strip six">
              <Metric label="Total Members" value={metricValue(String(memberRows.length))} />
              <Metric green label="Member Vargani" note={metricNote(`${memberRows.filter((member) => member.paid).length} Members Paid`)} value={metricValue(money(memberVargani))} />
              <Metric green label="Slip Vargani" note={metricNote(`${slipRows.length} Slips Paid`)} value={metricValue(money(totalSlipCollection))} />
              <Metric red label="Pending (Members)" note={metricNote(`${memberRows.filter((member) => !member.paid).length} Pending`)} value={metricValue(money(pendingMemberVargani))} />
              <Metric blue label="Mandal Expenses" note={metricNote('Paid by Mandal')} value={metricValue(money(expensesTotal))} />
              <Metric blue label="Remaining Balance" note={metricNote('Available Funds')} value={metricValue(money(balance))} />
            </div>
            <div className="wide-card groups-card">
              <div>
                <h2>Collection Groups</h2>
                <span>Create area-wise teams, assign a leader, and attach members or tasks to that group.</span>
              </div>
              <button className="blue-action" onClick={() => setGroupOpen(true)} type="button"><Plus size={18} />Add Group</button>
              <div className="group-list">
                {groups.length === 0 && <span className="soft-empty">No groups created yet. Add groups like Main Road, Bazaar Lane, or Sponsor Team.</span>}
                {groupsWithStats.map((group) => (
                  <article className="group-chip-card" key={group.id}>
                    <div className="group-chip-top">
                      <div>
                        <strong>{group.name}</strong>
                        <span>{group.areaName || 'Area not set'}</span>
                      </div>
                      <b>{money(group.collected)}</b>
                    </div>
                    <div className="group-chip-metrics">
                      <span>{group.memberCount} members</span>
                      <span>{group.slipCount} paid slips</span>
                    </div>
                    <label className="group-leader-picker">
                      <span>Leader</span>
                      <select
                        value={group.leader?.id ?? ''}
                        onChange={(event) => void onUpdateGroup(group.id, { leaderUserId: event.target.value || null })}
                      >
                        <option value="">Assign leader</option>
                        {members.map((member) => {
                          const userId = memberUserId(member);
                          return userId ? <option key={member.id} value={userId}>{member.displayName}</option> : null;
                        })}
                      </select>
                    </label>
                    <div className="group-member-preview">
                      {group.memberRows.length === 0 && <small>No members linked yet.</small>}
                      {group.memberRows.slice(0, 5).map((row) => (
                        <small key={row.member.id}>
                          <span>{row.name}{row.isLeader && <em className="leader-badge">Leader</em>}</span>
                          <b>{money(row.collected)}</b>
                        </small>
                      ))}
                      {group.memberRows.length > 5 && <small>+{group.memberRows.length - 5} more members</small>}
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="ops-table members-table">
              <div className="ops-head members-head"><span>Name & Role</span><span>Group</span><span>Contact</span><span>Collected by user</span><span>Vargani (2026)</span><span>Actions</span></div>
              {isInitialSync && <EmptyTableState message="Loading live member data..." />}
              {workspaceLoaded && memberRows.length === 0 && <EmptyTableState message="No members added yet." />}
              {memberRows.map((member) => (
                <div className="ops-row member-row" key={member.member.id}>
                  <strong>{member.name}<small>{member.role}</small></strong>
                  <label className={`member-group-control ${member.isOrphanLeader ? 'needs-group' : member.rawGroupId ? '' : 'no-group'}`}>
                    <select
                      value={member.rawGroupId}
                      onChange={(event) => void onAssignMemberGroup(member.member, event.target.value)}
                    >
                      <option value="">No group</option>
                      {groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}
                    </select>
                    {member.isOrphanLeader && <small>Leader role without a group</small>}
                  </label>
                  <span>{member.contact}</span>
                  <span><b>{money(member.collected)}</b><small>{member.paidSlipCount} slips collected</small></span>
                  <span><b>{money(member.vargani)}</b><i className={member.paid ? 'pill paid' : 'pill pending'}>{member.paid ? 'Paid' : 'Pending'}</i></span>
                  <span className="row-actions">
                    <button onClick={() => void onEditMember(member.member)} type="button"><Edit3 size={16} /></button>
                    <button onClick={() => onRemindMember(member.member)} type="button"><MessageSquare size={16} /></button>
                    <button onClick={() => void onArchiveMember(member.member)} type="button"><Trash2 size={16} /></button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'tasks' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div><h2>Task Board (2026)</h2><span>Assign festival work and monitor open responsibilities.</span></div>
              <button className="blue-action" onClick={() => { setEditingTask(null); setTaskOpen(true); }} type="button"><Plus size={18} />Add Task</button>
            </div>
            <div className="metric-strip">
              <Metric label="Open Tasks" value={String(tasks.filter((task) => task.status !== 'DONE').length)} />
              <Metric blue label="Teams Assigned" value={String(new Set(tasks.map((task) => task.assignee?.name).filter(Boolean)).size)} />
              <Metric green label="This Week" value={String(tasks.length)} />
            </div>
            <div className="ops-table tasks-table">
              <div className="ops-head five"><span>Task</span><span>Owner / Group</span><span>Due Date</span><span>Status</span><span>Actions</span></div>
              {tasks.length === 0 && <EmptyTableState message="No tasks added yet." />}
              {tasks.map((task) => (
                <div className="ops-row five" key={task.id}>
                  <strong>{task.title}<small>{task.notes || 'No notes'}</small></strong>
                  <span>{task.assignee?.name ?? 'Unassigned'}<small>{task.group?.name ?? 'No group'}</small></span>
                  <span>{task.dueDate?.slice(0, 10) ?? '-'}</span>
                  <span><i className={task.status === 'DONE' ? 'pill paid' : 'pill pending'}>{task.status}</i><i className="pill mode">{task.priority}</i></span>
                  <span className="row-actions">
                    <button onClick={() => void onTaskDone(task)} type="button"><CheckCircle2 size={16} /></button>
                    <button onClick={() => { setEditingTask(task); setTaskOpen(true); }} type="button"><Edit3 size={16} /></button>
                    <button onClick={() => void onDeleteTask(task)} type="button"><Trash2 size={16} /></button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'expenses' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div><h2>Expenses (2026)</h2><span>Total for 2026: <b>{money(expensesTotal)}</b></span></div>
              <button className="blue-action" onClick={() => setExpenseOpen(true)} type="button"><Plus size={18} />Add Expense</button>
            </div>
            <div className="ops-table expenses-table">
              <div className="ops-head six"><span>Description</span><span>Vendor</span><span>Paid By</span><span>Category</span><span>Date</span><span>Amount</span><span>Refund?</span><span>Actions</span></div>
              {expenses.length === 0 && <EmptyTableState message="No expenses added yet." />}
              {expenses.map((expense) => (
                <div className="ops-row six" key={expense.id}>
                  <strong>{expense.notes || 'Expense'}</strong><span>{expense.vendorName || '-'}</span><i className="pill role">{expense.creator?.name ?? session.user.name}</i><span>{expense.category?.name ?? 'Miscellaneous'}</span><span>{expense.expenseDate.slice(0, 10)}</span><b>{money(Number(expense.amount))}</b><i className="pill pending">{expense.status}</i>
                  <span className="row-actions">
                    <button onClick={() => void onEditExpense(expense)} type="button"><Edit3 size={16} /></button>
                    <button onClick={() => void onDeleteExpense(expense)} type="button"><Trash2 size={16} /></button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'template' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div>
                <h2>Vargani Template</h2>
                <span>Upload slip artwork, drag fields, resize boxes, and tune font styles.</span>
              </div>
              <button className="blue-action" onClick={onRefresh} type="button"><RefreshCw size={18} />Sync Template</button>
            </div>
            <TemplateView
              activeForm={activeForm}
              activeTemplate={activeTemplate}
              latestTemplateVersion={latestTemplateVersion}
              onAddField={() => undefined}
              onPreviewChange={onPreviewChange}
              onSaveTemplate={saveTemplate}
              templatePreview={templatePreview}
            />
          </section>
        )}

        {screen === 'slips' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div><h2>Vargani Slips</h2><span>Generate and manage vargani receipts.</span></div>
              <button className="blue-action" onClick={() => setEntryOpen(true)} type="button"><Plus size={18} />New Vargani Entry</button>
            </div>
            <div className="metric-strip five-cols">
              <Metric label="Total Entries" value={metricValue(String(slipRows.length))} />
              <Metric green label="Collected" note={metricNote(`${paidSlipRows.length} Paid`)} value={metricValue(money(totalSlipCollection))} />
              <Metric red label="Pending" note={metricNote(`${pendingSlipRows.length} Pending`)} value={metricValue(money(pendingSlipRows.reduce((sum, slip) => sum + Number(slip.amount || 0), 0)))} />
              <Metric green label="Paid Slips" value={metricValue(String(paidSlipRows.length))} />
              <Metric blue label="Pending Slips" value={metricValue(String(pendingSlipRows.length))} />
            </div>
            <div className="slip-insights">
              <div className="insight-card warning">
                <strong>Pending Location-wise ({money(pendingSlipRows.reduce((sum, slip) => sum + Number(slip.amount || 0), 0))})</strong>
                <div className="chips">
                  {pendingSlipRows.length === 0 ? <span>No pending slips</span> : pendingSlipRows.map((slip) => (
                    <span key={`${slip.id}-pending`}>{slip.areaName || 'No area'} {money(Number(slip.amount || 0))}</span>
                  ))}
                </div>
              </div>
              <div className="insight-card blue">
                <strong>Slips Generated</strong>
                <div className="chips">{slipRows.length === 0 ? <span>No slips generated</span> : <span>{slipRows.length} Live Slips</span>}</div>
              </div>
            </div>
            <div className="table-toolbar">
              <div className="segmented">
                <button className={slipFilter === 'all' ? 'active' : ''} onClick={() => setSlipFilter('all')} type="button">All ({slipRows.length})</button>
                <button className={slipFilter === 'paid' ? 'active' : ''} onClick={() => setSlipFilter('paid')} type="button">Paid ({paidSlipRows.length})</button>
                <button className={slipFilter === 'pending' ? 'active' : ''} onClick={() => setSlipFilter('pending')} type="button">Pending ({pendingSlipRows.length})</button>
              </div>
              <label className="search-inline"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, location, admin, date..." /></label>
            </div>
            <div className="ops-table slips-table">
              <div className="ops-head six"><span>Slip #</span><span>Name / Shop</span><span>Amount</span><span>Mobile</span><span>Status / Mode</span><span>Date / Info</span><span>Actions</span></div>
              {isInitialSync && <EmptyTableState message="Loading live slip data..." />}
              {workspaceLoaded && filteredSlipRows.length === 0 && <EmptyTableState message="No slips found for this filter." />}
              {filteredSlipRows.map((slip) => (
                <div className="ops-row six" key={slip.id}>
                  <b>{slip.slipNumber}</b><strong>{slip.contributorName}<small>{slip.shopName ?? '-'}</small></strong><b>{money(Number(slip.amount))}</b><span>{slip.contributorPhone ?? '-'}</span>
                  <span><i className={isSlipPaid(slip) ? 'pill paid' : 'pill pending'}>{isSlipPaid(slip) ? 'Paid' : 'Pending'}</i><i className="pill mode">{slip.paymentMode}</i></span><span>{slip.createdAt.slice(0, 10)}</span>
                  <span className="row-actions">
                    <button onClick={() => { setSelectedSlip(slip); void onEditSlip(slip); }} type="button"><Edit3 size={16} />Edit</button>
                    <button className="mini-link" onClick={() => { setSelectedSlip(slip); void onDownloadSlip(slip); }} type="button"><Download size={16} />Slip</button>
                    <button onClick={() => { setSelectedSlip(slip); void onShareSlip(slip); }} type="button"><Share2 size={16} />Share</button>
                    <button onClick={() => void onCancelSlip(slip)} type="button"><Trash2 size={16} /></button>
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'form' && (
          <FormManagementView
            activeForm={activeForm}
            busy={busy}
            onCreateField={onCreateCustomField}
            onDeleteField={onDeleteCustomField}
            onUpdateField={onUpdateCustomField}
          />
        )}

        {screen === 'users' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div><h2>User Management</h2><span>Admins, sub-admins, and collection access.</span></div>
              <label className="search-inline"><Search size={18} /><input placeholder="Search users..." /></label>
            </div>
            <div className="metric-strip">
              <Metric label="Total Users" value={String(userRows.length)} />
              <Metric blue label="Admins" value={String(userRows.filter((user) => user.role.includes('ADMIN')).length)} />
              <Metric blue label="Members" value={String(userRows.filter((user) => !user.role.includes('ADMIN')).length)} />
              <Metric green label="Total Entries" value={String(slipRows.length)} />
            </div>
            <div className="ops-table users-table">
              <div className="ops-head five"><span>User</span><span>Email</span><span>Role</span><span>Entries</span><span>Actions</span></div>
              {userRows.map((user) => (
                <div className="ops-row five" key={`${user.name}-${user.email}`}>
                  <strong><span className="avatar tiny">{user.name.charAt(0).toUpperCase()}</span>{user.name}<small>{user.joined}</small></strong>
                  <span>{user.email}</span><i className="pill role">{user.role}</i><span>{user.entries}</span>
                  <span className="row-actions"><button onClick={() => user.member ? void onEditMember(user.member) : showToast('Super admin controls the main admin role.')} type="button"><UserCog size={16} />Edit Role</button></span>
                </div>
              ))}
            </div>
          </section>
        )}

        {screen === 'logs' && (
          <section className="adhyaksh-page">
            <div className="wide-card action-card">
              <div><h2>Activity History</h2><span>Real-time logs for receipts, payments, and users.</span></div>
              <span className="real-time"><History size={18} />Real-time Logs</span>
            </div>
            <div className="ops-table logs-table">
              <div className="ops-head"><span>Time & Date</span><span>User</span><span>Action</span><span>Details</span></div>
              {slipRows.length === 0 && <EmptyTableState message="No activity yet." />}
              {slipRows.slice(0, 8).map((slip) => {
                const createdAt = formatLogTimestamp(slip.createdAt);
                return (
                <div className="ops-row" key={`${slip.id}-log`}>
                  <span><b>{createdAt.date}</b><small>{createdAt.time}</small></span>
                  <i className="pill role">{slip.collector?.name || session.user.name}</i>
                  <strong>VARGANI SLIP CREATED</strong>
                  <span>Slip {slip.slipNumber} for {slip.contributorName} - {money(Number(slip.amount))} (paid)</span>
                </div>
              );
              })}
            </div>
          </section>
        )}
      </section>

      {entryOpen && (
        <div className="modal-backdrop">
          <form className="vargani-modal adhyaksh-modal" onSubmit={async (event) => { await onGenerate(event); setEntryOpen(false); setEntryStatus('ACTIVE'); }}>
            <button className="modal-close" onClick={() => setEntryOpen(false)} type="button"><X size={20} /></button>
            <h2>New Vargani Entry</h2>
            <label>Name<input name="contributorName" required placeholder="Enter full name" /></label>
            <label>Shop Name<input name="shopName" placeholder="Enter shop / business name" /></label>
            <label>Amount<input name="amount" inputMode="numeric" required placeholder="1500" /></label>
            <label>Location<input name="areaName" required placeholder="Main Road, Pune" /></label>
            <label>
              Collection Group
              <select name="groupId" defaultValue="">
                <option value="">No group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}{group.areaName ? ` - ${group.areaName}` : ''}</option>
                ))}
              </select>
            </label>
            <label>Address<textarea name="contributorAddress" placeholder="Full address optional" /></label>
            <label>WhatsApp Number<input name="contributorPhone" placeholder="10 digit WhatsApp number" /></label>
            <PaymentStatusSelector value={entryStatus} onChange={setEntryStatus} />
            <label>Payment Mode<select name="paymentMode" defaultValue="CASH"><option value="CASH">Cash</option><option value="UPI">Online / UPI</option><option value="CHEQUE">Cheque</option></select></label>
            {entryStatus === 'PENDING' && (
              <label className="pending-date-card">Tentative Payment Date<input name="tentativePaymentDate" type="date" /></label>
            )}
            {(activeForm?.customFields ?? []).map((field) => <CustomFieldInput field={field} key={field.id} />)}
            <div className="modal-actions"><button type="button" onClick={() => setEntryOpen(false)}>Cancel</button><button className={entryStatus === 'PENDING' ? 'pending-action' : 'success'} onClick={(event) => { if (event.currentTarget.form?.checkValidity()) onPrepareWhatsApp(entryStatus); }} type="submit">{entryStatus === 'PENDING' ? <Clock size={18} /> : <CheckCircle2 size={18} />}{entryStatus === 'PENDING' ? 'Save as Pending' : 'Confirm & Generate Slip'}</button></div>
          </form>
        </div>
      )}

      {groupOpen && (
        <div className="modal-backdrop">
          <form className="vargani-modal adhyaksh-modal" onSubmit={async (event) => { await onCreateGroup(event); setGroupOpen(false); }}>
            <button className="modal-close" onClick={() => setGroupOpen(false)} type="button"><X size={20} /></button>
            <h2>Add Collection Group</h2>
            <label>Group Name<input name="name" required placeholder="Main Road Team" /></label>
            <label>Area / Locality<input name="areaName" placeholder="Main Road, Lohgaon" /></label>
            <label>
              Group Leader
              <select name="leaderUserId" defaultValue="">
                <option value="">Assign later</option>
                {members.map((member) => {
                  const userId = memberUserId(member);
                  return userId ? <option key={member.id} value={userId}>{member.displayName}</option> : null;
                })}
              </select>
            </label>
            <div className="modal-actions">
              <button type="button" onClick={() => setGroupOpen(false)}>Cancel</button>
              <button className="blue-action" type="submit">Create Group</button>
            </div>
          </form>
        </div>
      )}

      {taskOpen && (
        <div className="modal-backdrop">
          <form
            className="vargani-modal adhyaksh-modal"
            onSubmit={async (event) => {
              if (editingTask) {
                await onEditTask(editingTask, event);
              } else {
                await onCreateTask(event);
              }
              setTaskOpen(false);
              setEditingTask(null);
            }}
          >
            <button className="modal-close" onClick={() => { setTaskOpen(false); setEditingTask(null); }} type="button"><X size={20} /></button>
            <h2>{editingTask ? 'Edit Task' : 'Add Task'}</h2>
            <label>Task Name<input name="title" required defaultValue={editingTask?.title ?? ''} placeholder="Collect pending vargani from Main Road" /></label>
            <label>
              Assign To
              <select name="assigneeUserId" defaultValue={editingTask?.assigneeUserId ?? ''}>
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.id} value={member.user?.id ?? ''}>{member.displayName} ({member.user?.role?.replaceAll('_', ' ') ?? 'Member'})</option>
                ))}
              </select>
            </label>
            <label>
              Group / Area
              <select name="groupId" defaultValue={editingTask?.groupId ?? ''}>
                <option value="">No group</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}{group.areaName ? ` - ${group.areaName}` : ''}</option>
                ))}
              </select>
            </label>
            <label>Due Date<input name="dueDate" defaultValue={editingTask?.dueDate?.slice(0, 10) ?? ''} type="date" /></label>
            <label>
              Priority
              <select name="priority" defaultValue={editingTask?.priority ?? 'MEDIUM'}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </label>
            <label>
              Status
              <select name="status" defaultValue={editingTask?.status ?? 'OPEN'}>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </label>
            <label className="full">Notes<textarea name="notes" defaultValue={editingTask?.notes ?? ''} placeholder="What needs to be done, where, and any phone/payment detail." /></label>
            <div className="modal-actions">
              <button type="button" onClick={() => { setTaskOpen(false); setEditingTask(null); }}>Cancel</button>
              <button className="blue-action" type="submit">{editingTask ? 'Save Task' : 'Create Task'}</button>
            </div>
          </form>
        </div>
      )}

      {memberOpen && (
        <div className="modal-backdrop">
          <form className="vargani-modal adhyaksh-modal" onSubmit={(event) => { onCreateMember(event); setMemberOpen(false); }}>
            <button className="modal-close" onClick={() => setMemberOpen(false)} type="button"><X size={20} /></button>
            <h2>Add Member</h2>
            <p className="modal-help">Create member login here. Make someone a group leader from Collection Groups.</p>
            <label>Name<input name="name" required placeholder="Member name" /></label>
            <label>Email<input name="email" required placeholder="member@mandal.local" /></label>
            <label>Phone<input name="phone" placeholder="+91..." /></label>
            <label>Password<input name="password" required placeholder="Create a strong password" type="password" /></label>
            <label>Group<select name="groupId"><option value="">No group</option>{groups.map((group) => <option key={group.id} value={group.id}>{group.name}</option>)}</select></label>
            <label>Area<input name="areaName" placeholder="Market Area" /></label>
            <div className="modal-actions"><button type="button" onClick={() => setMemberOpen(false)}>Cancel</button><button className="blue-action" type="submit">Create Member Login</button></div>
          </form>
        </div>
      )}

      {expenseOpen && (
        <div className="modal-backdrop">
          <form className="vargani-modal adhyaksh-modal" onSubmit={async (event) => { await onCreateExpense(event); setExpenseOpen(false); }}>
            <button className="modal-close" onClick={() => setExpenseOpen(false)} type="button"><X size={20} /></button>
            <h2>Add Expense</h2>
            <label>Description<input name="description" required placeholder="Expense description" /></label>
            <label>Vendor<input name="vendor" placeholder="Vendor name" /></label>
            <label>Paid By<input name="paidBy" placeholder="Member name" /></label>
            <label>Category<input name="category" placeholder="Decoration, sound..." /></label>
            <label>Date<input name="date" type="date" /></label>
            <label>Amount<input name="amount" inputMode="numeric" required placeholder="3500" /></label>
            <div className="modal-actions"><button type="button" onClick={() => setExpenseOpen(false)}>Cancel</button><button className="blue-action" type="submit">Save Expense</button></div>
          </form>
        </div>
      )}
    </main>
  );
}

function Metric({ blue, green, label, note, red, value }: { blue?: boolean; green?: boolean; label: string; note?: string; red?: boolean; value: string }) {
  return (
    <article className={`metric-card ${green ? 'green' : ''} ${red ? 'red' : ''} ${blue ? 'blue' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}

function EmptyTableState({ message }: { message: string }) {
  return (
    <div className="empty-state inline">
      <ReceiptText size={28} />
      <strong>{message}</strong>
    </div>
  );
}

function CustomFieldInput({ field }: { field: CustomField }) {
  const name = `custom_${field.key}`;
  const label = `${field.label}${field.required ? ' *' : ''}`;
  const type = field.type.toUpperCase();

  if (type === 'DROPDOWN') {
    return (
      <label>
        {label}
        <select name={name} required={field.required} defaultValue="">
          <option value="">Select {field.label}</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>
    );
  }

  if (type === 'LONG_TEXT') {
    return <label>{label}<textarea name={name} required={field.required} /></label>;
  }

  if (type === 'NUMBER') {
    return <label>{label}<input inputMode="numeric" name={name} required={field.required} /></label>;
  }

  if (type === 'DATE') {
    return <label>{label}<input name={name} required={field.required} type="date" /></label>;
  }

  if (type === 'CHECKBOX') {
    return (
      <label className="check-line">
        <input name={name} required={field.required} type="checkbox" value="yes" />
        {label}
      </label>
    );
  }

  return <label>{label}<input name={name} required={field.required} /></label>;
}

function FormManagementView({
  activeForm,
  busy,
  onCreateField,
  onDeleteField,
  onUpdateField,
}: {
  activeForm: ActiveForm | null;
  busy: boolean;
  onCreateField: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onDeleteField: (field: CustomField) => Promise<void> | void;
  onUpdateField: (field: CustomField, patch: Partial<CustomField>) => Promise<void> | void;
}) {
  const fields = [...(activeForm?.customFields ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section className="adhyaksh-page">
      <div className="wide-card action-card">
        <div>
          <h2>Vargani Form Management</h2>
          <span>Configure extra questions shown while creating a vargani entry. Use these fields for details that change mandal to mandal.</span>
        </div>
      </div>

      <div className="form-management-grid">
        <form className="form-management-card add-question-card" onSubmit={onCreateField}>
          <div>
            <h3>Add Custom Question</h3>
            <p>Add fields like donor type, building / lane, receipt note, sponsor category, or booth area. These can also be placed on the slip template.</p>
          </div>
          <div className="question-form-grid">
          <label>Question Label<input name="label" placeholder="e.g. Donor Type" required /></label>
          <label>
            Type
            <select name="type" defaultValue="TEXT">
              <option value="TEXT">Text</option>
              <option value="LONG_TEXT">Long Text</option>
              <option value="NUMBER">Number</option>
              <option value="DATE">Date</option>
              <option value="DROPDOWN">Dropdown</option>
              <option value="CHECKBOX">Checkbox</option>
            </select>
          </label>
          <label className="full">Dropdown Options<input name="options" placeholder="Family, Shop, Sponsor" /></label>
          </div>
          <div className="form-switches">
            <label><input name="required" type="checkbox" /><span><strong>Compulsory</strong><small>User must answer this while creating entry.</small></span></label>
            <label><input name="printOnSlip" type="checkbox" /><span><strong>Print on slip</strong><small>Make this field available for receipt template.</small></span></label>
            <label><input name="dashboardFilter" type="checkbox" /><span><strong>Use in filters</strong><small>Useful for reports by area/type later.</small></span></label>
          </div>
          <button className="blue-action" disabled={busy || !activeForm} type="submit"><Plus size={18} />Add Question</button>
        </form>

        <div className="form-management-card current-questions-card">
          <div>
            <h3>Current Form Questions</h3>
            <p>Core receipt fields stay fixed for audit accuracy. Custom questions below are fully configurable.</p>
          </div>
          <div className="managed-fields-table">
            <div className="managed-fields-head">
              <span>ID</span>
              <span>Type</span>
              <span>Required</span>
              <span>English Label</span>
            </div>
            {fields.length === 0 && <EmptyTableState message="No custom form questions added yet." />}
            {fields.map((field) => (
              <div className="managed-fields-row" key={field.id}>
                <code>{field.key}</code>
                <span>{field.type.replace('_', ' ')}</span>
                <strong>{field.required ? 'Yes' : 'No'}</strong>
                <span>{field.label}</span>
                <span className="row-actions managed-field-actions">
                  <button
                    onClick={() => {
                      const nextLabel = window.prompt('Edit question label', field.label)?.trim();
                      if (nextLabel && nextLabel !== field.label) void onUpdateField(field, { label: nextLabel });
                    }}
                    type="button"
                  >
                    <Edit3 size={16} />Edit
                  </button>
                  <button onClick={() => void onUpdateField(field, { required: !field.required })} type="button">
                    {field.required ? 'Make Optional' : 'Make Compulsory'}
                  </button>
                  <button onClick={() => void onUpdateField(field, { printOnSlip: !field.printOnSlip })} type="button">
                    {field.printOnSlip ? 'Remove From Template Fields' : 'Allow On Template'}
                  </button>
                  <button className="danger" onClick={() => void onDeleteField(field)} type="button"><Trash2 size={16} />Delete</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminTopbar({
  language,
  onLanguageChange,
  session,
}: {
  language: Language;
  onLanguageChange: (language: Language) => void;
  session: AuthSession;
}) {
  return (
    <div className="app-topbar">
      <strong>{t(language, 'Digital Vargani')}</strong>
      <div className="top-search">
        <Search size={18} />
        <span>{t(language, 'Search')}</span>
        <kbd>Ctrl K</kbd>
      </div>
      <label className="language-picker">
        <select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)}>
          <option value="en">{t(language, 'English')}</option>
          <option value="mr">{t(language, 'Marathi')}</option>
          <option value="hi">{t(language, 'Hindi')}</option>
        </select>
      </label>
      <div className="top-user">
        <span>{session.user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
        <div>
          <strong>{session.user.name}</strong>
          <small>{session.user.role.replaceAll('_', ' ')}</small>
        </div>
      </div>
    </div>
  );
}

function SuperAdminApp({
  busy,
  demoMandals,
  language,
  notice,
  onCreateMandal,
  onLanguageChange,
  onLogout,
  onPreviewChange,
  onTemplateSaved,
  session,
  setSidebarOpen,
  sidebarOpen,
}: {
  busy: boolean;
  demoMandals: DemoMandal[];
  language: Language;
  notice: string;
  onCreateMandal: (event: FormEvent<HTMLFormElement>) => Promise<{ id?: string; ok: boolean }>;
  onLanguageChange: (language: Language) => void;
  onLogout: () => void;
  onPreviewChange: (url: string) => void;
  onTemplateSaved: (
    placements: Record<string, TemplatePlacement>,
    target?: { festivalId?: string; mandalId?: string; previewUrl?: string },
  ) => Promise<void> | void;
  session: AuthSession;
  setSidebarOpen: (open: boolean | ((current: boolean) => boolean)) => void;
  sidebarOpen: boolean;
}) {
  const mandals = demoMandals;
  const [ownerScreen, setOwnerScreen] = useState<OwnerScreen>(() => parseOwnerRoute()?.screen ?? 'dashboard');
  const [selectedIndex, setSelectedIndex] = useState(() => {
    const route = parseOwnerRoute();
    if (!route?.mandalId) return 0;
    const routeIndex = mandals.findIndex((mandal) => mandal.id === route.mandalId);
    return routeIndex >= 0 ? routeIndex : 0;
  });
  const [detailTab, setDetailTab] = useState<OwnerMandalTab>(() => parseOwnerRoute()?.tab ?? 'overview');
  const [addMandalOpen, setAddMandalOpen] = useState(false);
  const [managedIndex, setManagedIndex] = useState<number | null>(null);
  const [ownerQuery, setOwnerQuery] = useState('');
  const [loginBusy, setLoginBusy] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [mandalLogins, setMandalLogins] = useState<Record<string, Array<{ role: string; username: string; password: string }>>>({});
  const [ownerTemplateDrafts, setOwnerTemplateDrafts] = useState<Record<string, string>>({});
  const selectedMandal = mandals[Math.min(selectedIndex, mandals.length - 1)];
  const selectedKey = selectedMandal?.id ?? selectedMandal?.name ?? '';
  const extraLogins = mandalLogins[selectedKey] ?? [];
  const selectedTemplateVersion = selectedMandal?.festivals?.[0]?.templates?.[0]?.versions?.[0];
  const selectedTemplatePreview = resolveTemplateAssetUrl(
    (selectedKey && ownerTemplateDrafts[selectedKey]) || selectedTemplateVersion?.backgroundFileUrl || TEMPLATE_IMAGE,
  );
  const adminUser = selectedMandal?.users?.find((user) => user.role === 'MANDAL_ADMIN');
  const persistedLogins =
    selectedMandal?.users
      ?.filter((user) => user.role !== 'MANDAL_ADMIN')
      .map((user) => ({
        password: 'Stored securely in backend',
        role: user.role.replaceAll('_', ' '),
        username: user.email || user.phone || user.name,
      })) ?? [];
  const ownerLoginRows = [
    {
      password: selectedMandal?.adminPassword || 'Stored securely in backend',
      role: 'Adhyaksh',
      username: selectedMandal?.adminEmail || adminUser?.email || adminUser?.phone || (selectedMandal ? `admin@${slugify(selectedMandal.name)}.local` : ''),
    },
    ...extraLogins,
    ...persistedLogins.filter((login) => !extraLogins.some((extra) => extra.username === login.username)),
  ];
  const totalMembers = mandals.reduce((sum, mandal) => sum + Number(mandal._count?.members ?? mandal.memberCount ?? 0), 0);
  const totalSlipsGenerated = mandals.reduce((sum, mandal) => sum + Number(mandal._count?.slips ?? 0), 0);
  const filteredMandals = mandals
    .map((mandal, index) => ({ index, mandal }))
    .filter(({ mandal }) => {
      const query = ownerQuery.trim().toLowerCase();
      if (!query) return true;
      return [mandal.name, mandal.address, mandal.locality, mandal.city, mandal.contactEmail]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));
    });

  function syncOwnerRoute() {
    const route = parseOwnerRoute();
    if (!route) return;
    setOwnerScreen(route.screen);
    setDetailTab(route.tab);
    setSidebarOpen(false);

    if (route.isNew) {
      setManagedIndex(null);
      setAddMandalOpen(true);
      return;
    }

    setAddMandalOpen(false);

    if (route.screen !== 'mandals' || !route.mandalId) {
      setManagedIndex(null);
      return;
    }

    const routeIndex = mandals.findIndex((mandal) => mandal.id === route.mandalId);
    if (routeIndex >= 0) {
      setSelectedIndex(routeIndex);
      setManagedIndex(routeIndex);
    }
  }

  useEffect(() => {
    const route = parseOwnerRoute();
    if (!route) {
      writeRoute(routeForOwner(ownerScreen, managedIndex !== null ? selectedMandal?.id : null, detailTab), 'replace');
    } else {
      syncOwnerRoute();
    }

    window.addEventListener('hashchange', syncOwnerRoute);
    window.addEventListener('popstate', syncOwnerRoute);
    return () => {
      window.removeEventListener('hashchange', syncOwnerRoute);
      window.removeEventListener('popstate', syncOwnerRoute);
    };
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [mandals.length]);

  function openOwnerScreen(screen: OwnerScreen) {
    setOwnerScreen(screen);
    setManagedIndex(null);
    setAddMandalOpen(false);
    writeRoute(routeForOwner(screen));
    setSidebarOpen(false);
  }

  function openAddMandal() {
    setOwnerScreen('mandals');
    setManagedIndex(null);
    setAddMandalOpen(true);
    writeRoute(routeForNewMandal());
    setSidebarOpen(false);
  }

  function openMandal(index: number) {
    const mandal = mandals[index];
    setSelectedIndex(index);
    setManagedIndex(index);
    setOwnerScreen('mandals');
    setDetailTab('overview');
    setAddMandalOpen(false);
    writeRoute(routeForOwner('mandals', mandal?.id, 'overview'));
    setSidebarOpen(false);
  }

  function openMandalTab(tab: OwnerMandalTab) {
    setDetailTab(tab);
    writeRoute(routeForOwner('mandals', selectedMandal?.id, tab));
  }

  function handleOwnerTemplatePreviewChange(url: string) {
    const resolvedUrl = resolveTemplateAssetUrl(url);
    if (!selectedKey) {
      onPreviewChange(resolvedUrl);
      return;
    }
    setOwnerTemplateDrafts((current) => ({ ...current, [selectedKey]: resolvedUrl }));
    onPreviewChange(resolvedUrl);
  }

  async function createLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedMandal?.id) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const username = String(form.get('username') || '').trim();
    const normalizedPhone = username.includes('@') ? '' : normalizeOptionalIndianPhone(username);
    if (!username.includes('@') && !normalizedPhone) {
      setLoginMessage('Enter a valid email or Indian mobile number.');
      return;
    }
    const nextLogin = {
      password: String(form.get('password') || generateTemporaryPassword()),
      role: String(form.get('role') || 'Khajindar'),
      username: username.includes('@') ? username : normalizedPhone,
    };
    const roleMap: Record<string, UserRole> = {
      'Group Leader': 'GROUP_LEADER',
      Khajindar: 'KHAJINDAR',
      Karyakari: 'GROUP_LEADER',
      Member: 'MEMBER',
    };
    setLoginBusy(true);
    setLoginMessage('Creating login...');
    try {
      const createdUser = await apiRequest<MandalLoginUser>(
        `/mandals/${selectedMandal.id}/users`,
        {
          body: JSON.stringify({
            email: nextLogin.username.includes('@') ? nextLogin.username : undefined,
            name: String(form.get('name') || nextLogin.role),
            password: nextLogin.password,
            phone: nextLogin.username.includes('@') ? undefined : nextLogin.username,
            role: roleMap[nextLogin.role] ?? 'MEMBER',
          }),
          method: 'POST',
        },
        session,
      );
      setMandalLogins((current) => ({
        ...current,
        [selectedKey]: [
          {
            password: nextLogin.password,
            role: createdUser.role.replaceAll('_', ' '),
            username: createdUser.email || createdUser.phone || nextLogin.username,
          },
          ...(current[selectedKey] ?? []),
        ],
      }));
      formElement.reset();
      setLoginMessage('Login created. Copy it before leaving this screen.');
    } catch (error) {
      setLoginMessage(error instanceof Error ? error.message : 'Could not create login.');
    } finally {
      setLoginBusy(false);
    }
  }

  async function copyLogin(login: { password: string; role: string; username: string }) {
    const text = `Login URL: ${mandalLoginUrl()}\nRole: ${login.role}\nUsername: ${login.username}\nPassword: ${login.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setLoginMessage('Login copied.');
    } catch {
      window.prompt('Copy login details', text);
    }
  }

  return (
    <>
    <main className={`shell owner-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button className="mobile-menu-toggle" onClick={() => setSidebarOpen((open) => !open)} type="button">
        {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      {sidebarOpen && <button aria-label="Close menu" className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} type="button" />}
      <aside className="sidebar">
        <div className="brand">
          <span>DV</span>
          <div>
            <strong>{t(language, 'Digital Vargani')}</strong>
            <small>{t(language, 'Super Admin Console')}</small>
          </div>
        </div>
        <nav>
          <button className={ownerScreen === 'dashboard' ? 'active' : ''} onClick={() => openOwnerScreen('dashboard')} type="button">
            <LayoutDashboard size={19} />{t(language, 'Dashboard')}
          </button>
          <button className={ownerScreen === 'mandals' ? 'active' : ''} onClick={() => openOwnerScreen('mandals')} type="button">
            <Building2 size={19} />{t(language, 'Mandals')}
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span>O</span>
            <div>
              <strong>{session.user.name}</strong>
              <small>SUPER ADMIN</small>
            </div>
          </div>
          <button className="logout" onClick={() => { setSidebarOpen(false); onLogout(); }} type="button"><LogOut size={18} />{t(language, 'Logout')}</button>
        </div>
      </aside>

      <section className="content">
        <AdminTopbar language={language} onLanguageChange={onLanguageChange} session={session} />
        <header className="page-header">
          <div>
            <h1>{ownerScreen === 'dashboard' ? t(language, 'Dashboard') : t(language, 'Mandals')}</h1>
            <p>{ownerScreen === 'dashboard' ? 'Track all onboarded mandals and software operations.' : t(language, 'Add mandals and manage each client account.')}</p>
          </div>
          <div className="header-actions">
            <button onClick={openAddMandal} type="button"><Plus size={18} />{t(language, 'Add Mandal')}</button>
          </div>
        </header>
        <div className="notice">{notice}</div>

        {ownerScreen === 'dashboard' && (
          <>
            <section className="stats-grid compact owner-stat-grid">
              <Stat icon={<Building2 />} label={t(language, 'Total Mandals')} note="Onboarded client mandals" value={String(mandals.length)} />
              <Stat icon={<UsersRound />} label={t(language, 'Total Members')} note="Across all mandals" value={String(totalMembers)} />
              <Stat icon={<FileText />} label={t(language, 'Slips Generated')} note="Live receipt records" value={String(totalSlipsGenerated)} />
            </section>
            <section className="owner-list-head">
              <div>
                <h2>{t(language, 'Mandals')}</h2>
                <p>Each block represents one mandal. Open Manage to set logins and templates.</p>
              </div>
              <button className="primary" onClick={openAddMandal} type="button"><Plus size={18} />{t(language, 'Add Mandal')}</button>
            </section>
            <section className="owner-toolbar">
              <div className="search-input">
                <Search size={20} />
                <input onChange={(event) => setOwnerQuery(event.target.value)} placeholder={t(language, 'Search mandals by name, area, email...')} value={ownerQuery} />
              </div>
              <span>{filteredMandals.length} of {mandals.length} mandals</span>
            </section>
            <MandalCardGrid items={filteredMandals} onManage={openMandal} />
          </>
        )}

        {ownerScreen === 'mandals' && managedIndex === null && (
          <>
            <section className="stats-grid compact owner-stat-grid">
              <Stat icon={<Building2 />} label={t(language, 'Total Mandals')} note="Onboarded" value={String(mandals.length)} />
              <Stat icon={<UsersRound />} label={t(language, 'Total Members')} note="Declared collectors" value={String(totalMembers)} />
              <Stat icon={<ReceiptText />} label={t(language, 'Slips Generated')} note="Across mandals" value={String(totalSlipsGenerated)} />
            </section>
            {addMandalOpen && (
              <form
                className="card form-grid owner-add-panel"
                onSubmit={async (event) => {
                  const created = await onCreateMandal(event);
                  if (!created.ok) return;
                  setAddMandalOpen(false);
                  if (created.id) {
                    setOwnerScreen('mandals');
                    setManagedIndex(null);
                    writeRoute(routeForOwner('mandals', created.id, 'overview'));
                  } else {
                    writeRoute(routeForOwner('mandals'));
                  }
                }}
              >
                <div className="panel-title full">
                  <Plus size={22} />
                  <div>
                    <strong>{t(language, 'Add Mandal')}</strong>
                    <span>{t(language, 'Mandal name is required. Address, logo, contacts and member count are optional.')}</span>
                  </div>
                  <button className="ghost-button" onClick={() => { setAddMandalOpen(false); writeRoute(routeForOwner('mandals')); }} type="button">Close</button>
                </div>
                <label className="full">Mandal Name *<input name="name" required placeholder="Ganesh Mitra Mandal" /></label>
                <label>{t(language, 'Address')}<input name="address" placeholder="Full mandal address" /></label>
                <label>Locality<input name="locality" placeholder="Main Road, Pune" /></label>
                <label>City<input name="city" defaultValue="Pune" /></label>
                <label>{t(language, 'Phone No.')}<input name="contactPhone" placeholder="+919876543210" /></label>
                <label>Contact Email<input name="contactEmail" placeholder="contact@mandal.local" /></label>
                <label>No. of Members<input name="memberCount" inputMode="numeric" placeholder="50" /></label>
                <label>Adhyaksh Name<input name="adhyakshName" placeholder="Main admin name" /></label>
                <label>Adhyaksh Email *<input name="adminEmail" required placeholder="admin@mandal.local" /></label>
                <label className="full">Adhyaksh Password *<input name="adminPassword" required type="password" placeholder="Minimum 12 characters" /></label>
                <label className="full">Mandal Logo<input accept="image/*" name="logo" type="file" /></label>
                <button className="primary full" disabled={busy} type="submit"><Plus size={18} />{busy ? 'Creating Mandal...' : t(language, 'Add Mandal')}</button>
              </form>
            )}
            <section className="owner-toolbar">
              <div className="search-input">
                <Search size={20} />
                <input onChange={(event) => setOwnerQuery(event.target.value)} placeholder={t(language, 'Search mandals by name, area, email...')} value={ownerQuery} />
              </div>
              <span>{filteredMandals.length} of {mandals.length} mandals</span>
            </section>
            <MandalCardGrid items={filteredMandals} onManage={openMandal} />
          </>
        )}

        {ownerScreen === 'mandals' && managedIndex !== null && selectedMandal && (
          <section className="owner-managed-view">
            <button className="back-link" onClick={() => openOwnerScreen('mandals')} type="button">
              <ArrowLeft size={20} />{t(language, 'Back to Mandals')}
            </button>
            <div className="card owner-detail-card">
              <div className="owner-detail-header">
                <MandalAvatar mandal={selectedMandal} />
                <div>
                  <strong>{selectedMandal.name}</strong>
                  <span>{selectedMandal.address || selectedMandal.locality || 'Address not added'}</span>
                </div>
              </div>
              <div className="detail-tabs">
                <button className={detailTab === 'overview' ? 'active' : ''} onClick={() => openMandalTab('overview')} type="button">{t(language, 'Overview')}</button>
                <button className={detailTab === 'template' ? 'active' : ''} onClick={() => openMandalTab('template')} type="button">{t(language, 'Template')}</button>
              </div>

              {detailTab === 'overview' && (
                <section className="owner-overview">
                  <div className="login-card">
                    <div className="panel-title">
                      <ShieldCheck size={22} />
                      <div>
                        <strong>{t(language, 'Adhyaksh Login')}</strong>
                        <span>Main mandal login to manage their team.</span>
                      </div>
                    </div>
                    <StatusLine label={t(language, 'Login URL')} value={mandalLoginUrl()} />
                    <StatusLine label={t(language, 'Username')} value={ownerLoginRows[0]?.username || `admin@${slugify(selectedMandal.name)}.local`} />
                    <StatusLine label={t(language, 'Password')} value={selectedMandal.adminPassword || 'Stored securely in backend'} />
                  </div>
                  <form className="card form-grid" onSubmit={createLogin}>
                    <div className="panel-title full">
                      <Plus size={22} />
                      <div>
                        <strong>{t(language, 'Generate More Logins')}</strong>
                        <span>Khajindar, karyakari, group leader, or member.</span>
                      </div>
                    </div>
                    <label>Role<select name="role"><option>Khajindar</option><option>Karyakari</option><option>Group Leader</option><option>Member</option></select></label>
                    <label>Name<input name="name" required placeholder="User name" /></label>
                    <label>Username<input name="username" required placeholder="khajindar@mandal.local" /></label>
                    <label>Password<input name="password" required type="password" placeholder="Minimum 8 characters" /></label>
                    <button className="primary" disabled={loginBusy} type="submit"><Plus size={18} />{loginBusy ? 'Creating Login...' : t(language, 'Generate Login')}</button>
                    {loginMessage && <span className="full notice compact">{loginMessage}</span>}
                  </form>
                  <div className="table-list">
                    {ownerLoginRows.map((login) => (
                      <div className="table-row owner-login-row" key={`${login.role}-${login.username}`}>
                        <span className="avatar small">{login.role.charAt(0)}</span>
                        <strong>{login.role}</strong>
                        <span>{login.username}</span>
                        <em>{login.password}</em>
                        <button onClick={() => copyLogin(login)} type="button"><Copy size={16} />Copy</button>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {detailTab === 'template' && (
                <TemplateView
                  activeForm={null}
                  language={language}
                  latestTemplateVersion={selectedTemplateVersion}
                  onAddField={() => undefined}
                  onPreviewChange={handleOwnerTemplatePreviewChange}
                  onSaveTemplate={async (placements) => {
                    await onTemplateSaved(placements, {
                      festivalId: selectedMandal.festivals?.[0]?.id,
                      mandalId: selectedMandal.id,
                      previewUrl: selectedTemplatePreview,
                    });
                    setOwnerTemplateDrafts((current) => {
                      const next = { ...current };
                      delete next[selectedKey];
                      return next;
                    });
                  }}
                  templatePreview={selectedTemplatePreview}
                />
              )}
            </div>
          </section>
        )}
      </section>
    </main>
    {loginBusy && <ActionLoaderOverlay message="Creating login..." />}
    </>
  );
}

function MandalCardGrid({
  items,
  onManage,
}: {
  items: Array<{ index: number; mandal: DemoMandal }>;
  onManage: (index: number) => void;
}) {
  return (
    <section className="mandal-card-grid">
      {items.map(({ index, mandal }) => (
        <article className="owner-client-card" key={`${mandal.name}-${index}`}>
          <div className="mandal-card-topline" />
          <div className="owner-client-main">
            <MandalAvatar mandal={mandal} />
            <div>
              <strong>{mandal.name}</strong>
              <span>{mandal.address || mandal.locality || mandal.city || 'Location not set'}</span>
            </div>
          </div>
          <div className="mandal-card-meta">
            <span>{Number(mandal.memberCount || 0)} members</span>
            <span>{mandal.contactPhone || 'Phone pending'}</span>
            <em>Template Ready</em>
          </div>
          <button onClick={() => onManage(index)} type="button">Manage</button>
        </article>
      ))}
      {!items.length && (
        <div className="empty-card">
          <Building2 size={34} />
          <strong>No mandals found</strong>
          <span>Try another search or add a new mandal.</span>
        </div>
      )}
    </section>
  );
}

function MandalAvatar({ mandal }: { mandal: DemoMandal }) {
  if (mandal.logoUrl) return <img alt="" className="mandal-avatar-img" src={mandal.logoUrl} />;
  return <span className="avatar">{mandal.name.charAt(0).toUpperCase()}</span>;
}

function getMandalIdentity(mandal: DemoMandal | null, session: AuthSession) {
  const fallbackName = session.user.mandalId ? 'Your Mandal' : 'Digital Vargani';
  const name = mandal?.name || fallbackName;
  const location = [mandal?.locality, mandal?.city].filter(Boolean).join(', ') || mandal?.address || 'Mandal workspace';
  return {
    address: mandal?.address || location,
    initials: name
      .split(/\s+/)
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'DV',
    location,
    logoUrl: mandal?.logoUrl || '',
    name,
    phone: mandal?.contactPhone || 'Phone not added',
  };
}

function PaymentStatusSelector({
  onChange,
  value,
}: {
  onChange: (value: 'ACTIVE' | 'PENDING') => void;
  value: 'ACTIVE' | 'PENDING';
}) {
  return (
    <fieldset className="payment-status-field">
      <legend>Payment Status *</legend>
      <div className="payment-status-grid">
        <label className={`payment-card paid ${value === 'ACTIVE' ? 'active' : ''}`}>
          <input
            checked={value === 'ACTIVE'}
            name="paymentStatus"
            onChange={() => onChange('ACTIVE')}
            type="radio"
            value="ACTIVE"
          />
          <CheckCircle2 size={24} />
          <strong>Payment Received</strong>
          <span>Slip will be generated</span>
        </label>
        <label className={`payment-card pending ${value === 'PENDING' ? 'active' : ''}`}>
          <input
            checked={value === 'PENDING'}
            name="paymentStatus"
            onChange={() => onChange('PENDING')}
            type="radio"
            value="PENDING"
          />
          <Clock size={24} />
          <strong>Pending</strong>
          <span>No slip until paid</span>
        </label>
      </div>
    </fieldset>
  );
}

function MemberCollectorApp({
  activeForm,
  busy,
  mandal,
  modalOpen,
  notice,
  onDownloadSlip,
  onGenerate,
  onLogout,
  onModalChange,
  onPrepareWhatsApp,
  onShareSlip,
  session,
  setSelectedSlip,
  slips,
}: {
  activeForm: ActiveForm | null;
  busy: boolean;
  mandal: DemoMandal | null;
  modalOpen: boolean;
  notice: string;
  onDownloadSlip: (slip: Slip) => Promise<void>;
  onGenerate: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
  onLogout: () => void;
  onModalChange: (open: boolean) => void;
  onPrepareWhatsApp: (paymentStatus: 'ACTIVE' | 'PENDING') => void;
  onShareSlip: (slip: Slip) => Promise<void>;
  session: AuthSession;
  setSelectedSlip: (slip: Slip) => void;
  slips: Slip[];
}) {
  const [entryStatus, setEntryStatus] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [slipFilter, setSlipFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [slipQuery, setSlipQuery] = useState('');
  const mandalIdentity = getMandalIdentity(mandal, session);

  useEffect(() => {
    if (!isMemberRoute()) {
      writeRoute(routeForMember(), 'replace');
    }
  }, []);

  const paidSlipRows = slips.filter(isSlipPaid);
  const pendingSlipRows = slips.filter((slip) => !isSlipPaid(slip));
  const filteredSlipRows = (slipFilter === 'paid' ? paidSlipRows : slipFilter === 'pending' ? pendingSlipRows : slips).filter((slip) => {
    const query = slipQuery.trim().toLowerCase();
    if (!query) return true;
    return [slip.slipNumber, slip.contributorName, slip.shopName, slip.areaName, slip.contributorPhone]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  });
  const collected = paidSlipRows.reduce((sum, slip) => sum + Number(slip.amount), 0);
  const paidSlips = paidSlipRows.length;

  return (
    <main className="member-shell">
      <aside className="member-sidebar">
        <div className="mandal-profile">
          {mandalIdentity.logoUrl ? <img alt="" className="mandal-avatar-img" src={mandalIdentity.logoUrl} /> : <div className="mandal-logo">{mandalIdentity.initials}</div>}
          <div>
            <h2>{mandalIdentity.name}</h2>
            <p>{mandalIdentity.location}</p>
          </div>
        </div>
        <div className="mandal-contact">
          <span>{mandalIdentity.address}</span>
          <span>{mandalIdentity.phone}</span>
        </div>
        <nav className="member-nav">
          <button className="active" type="button">
            <ReceiptText size={20} />
            Vargani Slips
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="user-chip">
            <span>{session.user.name.charAt(0)}</span>
            <div>
              <strong>{session.user.name}</strong>
              <small>{session.user.role === 'GROUP_LEADER' ? 'Group Leader' : 'Collection Member'}</small>
            </div>
          </div>
          <button className="logout" onClick={onLogout} type="button">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <section className="member-content">
        <header className="member-header">
          <div>
            <h1>Vargani Slips</h1>
            <p>{activeForm?.festival.name ?? 'Active Festival'}</p>
          </div>
          <select defaultValue="2026" aria-label="Active year">
            <option value="2026">Year 2026</option>
          </select>
        </header>

        <section className="member-hero">
          <div>
            <h2>Vargani Slips</h2>
            <p>Generate and manage your vargani receipts</p>
          </div>
          <button className="primary" onClick={() => onModalChange(true)} type="button">
            <Plus size={18} />
            New Vargani Entry
          </button>
        </section>

        <div className={`notice ${busy ? 'busy' : ''}`}>{busy ? 'Working...' : notice}</div>

        <section className="member-stats">
          <Stat icon={<ReceiptText />} label="Total Entries" note="Your slips" value={String(slips.length)} />
          <Stat icon={<BadgeIndianRupee />} label="Collected" note={`${paidSlips} paid`} value={money(collected)} />
          <Stat icon={<CheckCircle2 />} label="Paid Slips" note="Generated receipts" value={String(paidSlips)} />
          <Stat icon={<FileText />} label="Pending Slips" note="No slip until paid" value={String(pendingSlipRows.length)} />
        </section>

        <section className="member-table-card">
          <div className="table-toolbar">
            <div className="tab-strip">
              <button className={slipFilter === 'all' ? 'active' : ''} onClick={() => setSlipFilter('all')} type="button">All ({slips.length})</button>
              <button className={slipFilter === 'paid' ? 'active' : ''} onClick={() => setSlipFilter('paid')} type="button">Paid ({paidSlips})</button>
              <button className={slipFilter === 'pending' ? 'active' : ''} onClick={() => setSlipFilter('pending')} type="button">Pending ({pendingSlipRows.length})</button>
            </div>
            <div className="search-box"><Search size={18} /><input onChange={(event) => setSlipQuery(event.target.value)} placeholder="Search by name, shop, location..." value={slipQuery} /></div>
          </div>
          <div className="member-slip-table">
            <div className="member-slip-head">
              <span>Slip #</span><span>Name / Shop</span><span>Amount</span><span>Mobile</span><span>Status / Mode</span><span>Date</span><span>Actions</span>
            </div>
            {filteredSlipRows.map((slip) => (
              <div
                className="member-slip-row"
                key={slip.id}
                onClick={() => setSelectedSlip(slip)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') setSelectedSlip(slip);
                }}
                role="button"
                tabIndex={0}
              >
                <strong>{slip.slipNumber}</strong>
                <span>{slip.contributorName}<small>{slip.shopName || slip.areaName || '-'}</small></span>
                <b>{money(Number(slip.amount))}</b>
                <span>{slip.contributorPhone || '-'}</span>
                <em>{isSlipPaid(slip) ? 'Paid' : 'Pending'} - {slip.paymentMode}</em>
                <span>{new Date(slip.createdAt).toLocaleDateString('en-IN')}</span>
                <span className="row-actions" style={{ display: 'flex', gap: '6px' }}>
                  <button
                    className="mini-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedSlip(slip);
                      void onDownloadSlip(slip);
                    }}
                    type="button"
                  >
                    <Download size={15} /> Slip
                  </button>
                  <button
                    className="mini-link"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedSlip(slip);
                      void onShareSlip(slip);
                    }}
                    type="button"
                  >
                    <Share2 size={15} /> Share
                  </button>
                </span>
              </div>
            ))}
            {filteredSlipRows.length === 0 && <div className="empty-state">No slips found for this filter.</div>}
          </div>
        </section>
      </section>

      {modalOpen && (
        <div className="modal-backdrop">
          <form
            className="vargani-modal"
            onSubmit={async (event) => {
              await onGenerate(event);
              onModalChange(false);
              setEntryStatus('ACTIVE');
            }}
          >
            <button className="modal-close" onClick={() => onModalChange(false)} type="button">x</button>
            <div className="panel-title">
              <ReceiptText size={22} />
              <div>
                <strong>New Vargani Entry</strong>
                <span>Fill contribution details and generate slip.</span>
              </div>
            </div>
            <label>Name *<input name="contributorName" required placeholder="Enter full name" /></label>
            <label>Shop Name<input name="shopName" placeholder="Enter shop / business name" /></label>
            <label>Amount (Rs.) *<input inputMode="numeric" name="amount" required placeholder="e.g. 1500" /></label>
            <label>Location *<input name="areaName" required placeholder="e.g. Main Road, Pune" /></label>
            <label>Address<textarea name="contributorAddress" placeholder="Full address (optional)" /></label>
            <label>WhatsApp Number<input name="contributorPhone" placeholder="+91 10 digit WhatsApp number" /></label>
            <PaymentStatusSelector value={entryStatus} onChange={setEntryStatus} />
            {(activeForm?.customFields ?? []).map((field) => <CustomFieldInput field={field} key={field.id} />)}
            <label>
              Payment Mode *
              <select name="paymentMode" defaultValue="CASH">
                <option value="CASH">Cash</option>
                <option value="UPI">Online / UPI</option>
                <option value="CHEQUE">Cheque</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
              </select>
            </label>
            {entryStatus === 'PENDING' && (
              <label className="pending-date-card">Tentative Payment Date<input name="tentativePaymentDate" type="date" /></label>
            )}
            <div className="modal-actions">
              <button onClick={() => onModalChange(false)} type="button">Cancel</button>
              <button className={entryStatus === 'PENDING' ? 'pending-action' : 'success'} disabled={busy} onClick={(event) => { if (event.currentTarget.form?.checkValidity()) onPrepareWhatsApp(entryStatus); }} type="submit">{entryStatus === 'PENDING' ? <Clock size={18} /> : <CheckCircle2 size={18} />}{entryStatus === 'PENDING' ? 'Save as Pending' : 'Confirm & Generate Slip'}</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function LoginPanel({
  busy,
  notice,
  onSubmit,
}: {
  busy: boolean;
  notice: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [loginType, setLoginType] = useState<'owner' | 'mandal'>(() => {
    const params = new URLSearchParams(window.location.search);
    const route = cleanHash();
    return params.get('login') === 'owner' ||
      route === 'owner/login' ||
      route === 'super-admin/login' ||
      window.location.hash === '#owner'
      ? 'owner'
      : 'mandal';
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isOwner = loginType === 'owner';

  function setLoginMode(type: 'owner' | 'mandal') {
    setLoginType(type);
    writeRoute(routeForLogin(type === 'owner' ? 'owner' : 'mandal'));
  }

  useEffect(() => {
    const route = cleanHash();
    if (!['login', 'owner/login', 'super-admin/login'].includes(route)) {
      writeRoute(routeForLogin(isOwner ? 'owner' : 'mandal'), 'replace');
    }
  }, [isOwner]);

  useEffect(() => {
    function syncLoginRoute() {
      const route = cleanHash();
      if (route === 'owner/login' || route === 'super-admin/login' || window.location.hash === '#owner') {
        setLoginType('owner');
        return;
      }
      if (route === 'login') {
        setLoginType('mandal');
      }
    }

    window.addEventListener('hashchange', syncLoginRoute);
    window.addEventListener('popstate', syncLoginRoute);
    return () => {
      window.removeEventListener('hashchange', syncLoginRoute);
      window.removeEventListener('popstate', syncLoginRoute);
    };
  }, []);

  const shouldShowNotice = busy || (notice && notice !== 'Login with main mandal admin to open the console.');

  return (
    <main className="auth-page">
      <section className="auth-form-panel">
        <div className="auth-card">
          {isOwner && (
            <div className="auth-back-row">
              <span>Super Admin Access</span>
              <button
                onClick={() => setLoginMode('mandal')}
                type="button"
              >
                Back to Login
              </button>
            </div>
          )}

          <form className="login-panel clean" key={loginType} onSubmit={onSubmit}>
            <div className="panel-title">
              <ShieldCheck size={24} />
              <div>
                <strong>Admin Portal</strong>
                <span>Authorized Access Only</span>
              </div>
            </div>
            <label>
              Username or Email
              <input
                name="identifier"
                required
                defaultValue={isOwner ? DEFAULT_OWNER_IDENTIFIER : ''}
                placeholder={isOwner ? DEFAULT_OWNER_IDENTIFIER : 'Enter username or email'}
              />
            </label>
            <label>
              Password
              <span className="password-field">
                <input name="password" required type={passwordVisible ? 'text' : 'password'} placeholder="Enter password" />
                <button
                  aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                  onClick={() => setPasswordVisible((visible) => !visible)}
                  type="button"
                >
                  {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>
            <button className="primary" disabled={busy} type="submit">
              <ShieldCheck size={18} />
              Access Dashboard
            </button>
          </form>

          {shouldShowNotice && <div className={`notice ${busy ? 'busy' : ''}`}>{busy ? 'Working...' : notice}</div>}

          {isOwner && (
            <button className="auth-back-bottom" onClick={() => setLoginMode('mandal')} type="button">
              Back to Login
            </button>
          )}
        </div>
      </section>
      <a className="auth-powered" href="https://www.bracketdex.com/" rel="noreferrer" target="_blank">
        Powered by BracketDex Technologies
      </a>
    </main>
  );
}

function toMarathiDigits(val: string | number): string {
  const map: Record<string, string> = {
    '0': '०', '1': '१', '2': '२', '3': '३', '4': '४',
    '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
  };
  return String(val).replace(/[0-9]/g, (digit) => map[digit] ?? digit);
}

const MARATHI_WORD_MAP: Record<string, string> = {
  'Cash': 'नगद',
  'CASH': 'नगद (Cash)',
  'UPI': 'ऑनलाइन (UPI)',
  'CHEQUE': 'धनादेश (Cheque)',
  'BANK_TRANSFER': 'बँक ट्रान्सफर',
  'Main Road': 'मुख्य रस्ता',
  'Main Road, Pune': 'मुख्य रस्ता, पुणे',
  'Pune': 'पुणे',
  'Mahesh Traders': 'महेश ट्रेडर्स',
  'Sample Building': 'सॅम्पल बिल्डिंग',
  'Pramod': 'प्रमोद',
  'Amit Collector': 'अमित कलेक्टर',
  'Shop': 'दुकान',
};

function applyAutoMarathiTranslation(text: string, placement?: Partial<TemplatePlacement>): string {
  if (!placement?.autoMarathi && placement?.script !== 'Devanagari') return text;
  let translated = text;
  Object.entries(MARATHI_WORD_MAP).forEach(([eng, mr]) => {
    translated = translated.replace(new RegExp(eng, 'gi'), mr);
  });
  return toMarathiDigits(translated);
}

const INDIAN_NUMBER_ONES = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
  'Thirteen',
  'Fourteen',
  'Fifteen',
  'Sixteen',
  'Seventeen',
  'Eighteen',
  'Nineteen',
];

const INDIAN_NUMBER_TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function amountToIndianWords(value: number | string) {
  const amount = Math.floor(Number(value));
  if (!Number.isFinite(amount) || amount < 0) return '';
  return `${numberToIndianWords(amount)} Rupees Only`;
}

function numberToIndianWords(value: number): string {
  if (value === 0) return 'Zero';
  const parts: string[] = [];
  let remainder = value;
  const scales = [
    { label: 'Crore', value: 10000000 },
    { label: 'Lakh', value: 100000 },
    { label: 'Thousand', value: 1000 },
  ];

  scales.forEach((scale) => {
    const count = Math.floor(remainder / scale.value);
    if (count > 0) {
      parts.push(`${numberBelowThousand(count)} ${scale.label}`);
      remainder %= scale.value;
    }
  });

  if (remainder > 0) {
    parts.push(numberBelowThousand(remainder));
  }

  return parts.join(' ');
}

function numberBelowThousand(value: number): string {
  const parts: string[] = [];
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;

  if (hundreds > 0) {
    parts.push(`${INDIAN_NUMBER_ONES[hundreds]} Hundred`);
  }

  if (remainder > 0) {
    if (remainder < 20) {
      parts.push(INDIAN_NUMBER_ONES[remainder]);
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      parts.push(ones ? `${INDIAN_NUMBER_TENS[tens]} ${INDIAN_NUMBER_ONES[ones]}` : INDIAN_NUMBER_TENS[tens]);
    }
  }

  return parts.join(' ');
}

const MARATHI_NUMBER_BELOW_HUNDRED = [
  'शून्य',
  'एक',
  'दोन',
  'तीन',
  'चार',
  'पाच',
  'सहा',
  'सात',
  'आठ',
  'नऊ',
  'दहा',
  'अकरा',
  'बारा',
  'तेरा',
  'चौदा',
  'पंधरा',
  'सोळा',
  'सतरा',
  'अठरा',
  'एकोणीस',
  'वीस',
  'एकवीस',
  'बावीस',
  'तेवीस',
  'चोवीस',
  'पंचवीस',
  'सव्वीस',
  'सत्तावीस',
  'अठ्ठावीस',
  'एकोणतीस',
  'तीस',
  'एकतीस',
  'बत्तीस',
  'तेहतीस',
  'चौतीस',
  'पस्तीस',
  'छत्तीस',
  'सदतीस',
  'अडतीस',
  'एकोणचाळीस',
  'चाळीस',
  'एकेचाळीस',
  'बेचाळीस',
  'त्रेचाळीस',
  'चव्वेचाळीस',
  'पंचेचाळीस',
  'सेहेचाळीस',
  'सत्तेचाळीस',
  'अठ्ठेचाळीस',
  'एकोणपन्नास',
  'पन्नास',
  'एकावन्न',
  'बावन्न',
  'त्रेपन्न',
  'चौपन्न',
  'पंचावन्न',
  'छप्पन्न',
  'सत्तावन्न',
  'अठ्ठावन्न',
  'एकोणसाठ',
  'साठ',
  'एकसष्ट',
  'बासष्ट',
  'त्रेसष्ट',
  'चौसष्ट',
  'पासष्ट',
  'सहासष्ट',
  'सदुसष्ट',
  'अडुसष्ट',
  'एकोणसत्तर',
  'सत्तर',
  'एकाहत्तर',
  'बाहत्तर',
  'त्र्याहत्तर',
  'चौर्याहत्तर',
  'पंच्याहत्तर',
  'शहात्तर',
  'सत्याहत्तर',
  'अठ्ठ्याहत्तर',
  'एकोणऐंशी',
  'ऐंशी',
  'एक्याऐंशी',
  'ब्याऐंशी',
  'त्र्याऐंशी',
  'चौर्याऐंशी',
  'पंच्याऐंशी',
  'शहाऐंशी',
  'सत्त्याऐंशी',
  'अठ्ठ्याऐंशी',
  'एकोणनव्वद',
  'नव्वद',
  'एक्याण्णव',
  'ब्याण्णव',
  'त्र्याण्णव',
  'चौर्याण्णव',
  'पंच्याण्णव',
  'शहाण्णव',
  'सत्त्याण्णव',
  'अठ्ठ्याण्णव',
  'नव्याण्णव',
];

function amountToMarathiWords(value: number | string) {
  const amount = Math.floor(Number(value));
  if (!Number.isFinite(amount) || amount < 0) return '';
  return `${numberToMarathiWords(amount)} रुपये फक्त`;
}

function numberToMarathiWords(value: number): string {
  if (value === 0) return 'शून्य';
  const parts: string[] = [];
  let remainder = value;
  const scales = [
    { label: 'कोटी', value: 10000000 },
    { label: 'लाख', value: 100000 },
    { label: 'हजार', value: 1000 },
  ];

  scales.forEach((scale) => {
    const count = Math.floor(remainder / scale.value);
    if (count > 0) {
      parts.push(`${numberBelowThousandMarathi(count)} ${scale.label}`);
      remainder %= scale.value;
    }
  });

  if (remainder > 0) {
    parts.push(numberBelowThousandMarathi(remainder));
  }

  return parts.join(' ');
}

function numberBelowThousandMarathi(value: number): string {
  const hundreds = Math.floor(value / 100);
  const remainder = value % 100;
  const parts: string[] = [];

  if (hundreds > 0) {
    parts.push(hundreds === 1 ? 'शंभर' : `${MARATHI_NUMBER_BELOW_HUNDRED[hundreds]}शे`);
  }

  if (remainder > 0) {
    parts.push(MARATHI_NUMBER_BELOW_HUNDRED[remainder]);
  }

  return parts.join(' ');
}

function sampleFieldValue(key: string, label: string, placement?: Partial<TemplatePlacement>) {
  const samples: Record<string, string> = {
    amount: '5100',
    amountWords: 'Five Thousand One Hundred Rupees Only',
    amountWordsMarathi: 'पाच हजार शंभर रुपये फक्त',
    areaName: 'Main Road',
    building_name: 'Sample Building',
    collectorName: 'Amit Collector',
    contributorAddress: 'Main Road, Pune',
    contributorName: 'Mahesh Traders',
    contributorPhone: '9876543210',
    createdAt: '26/07/2026',
    donorType: 'Shop',
    paymentMode: 'UPI',
    shopName: 'Mahesh Traders',
    slipNumber: '003',
  };
  const raw = samples[key] ?? label;
  return applyAutoMarathiTranslation(raw, placement);
}

function FontDialogModal({
  initialPlacement,
  onClose,
  onSave,
  sampleText = 'AaBbYyZz · अमित कुलकर्णी ₹ ५,१००',
}: {
  initialPlacement: Partial<TemplatePlacement>;
  onClose: () => void;
  onSave: (updated: Partial<TemplatePlacement>) => void;
  sampleText?: string;
}) {
  const fonts = [
    { label: 'Century Gothic', value: '"Century Gothic", sans-serif' },
    { label: 'Noto Sans Devanagari', value: '"Noto Sans Devanagari", sans-serif' },
    { label: 'Microsoft Sans Serif', value: '"Microsoft Sans Serif", sans-serif' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Arial Narrow', value: '"Arial Narrow", Arial, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Yatra One', value: '"Yatra One", cursive' },
    { label: 'Rozha One', value: '"Rozha One", serif' },
    { label: 'Mukta', value: '"Mukta", sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
  ];

  const fontStyles = [
    { fontStyle: 'normal', fontWeight: 400, label: 'Regular' },
    { fontStyle: 'italic', fontWeight: 400, label: 'Italic' },
    { fontStyle: 'normal', fontWeight: 700, label: 'Bold' },
    { fontStyle: 'italic', fontWeight: 700, label: 'Bold Italic' },
    { fontStyle: 'normal', fontWeight: 900, label: 'Narrow Bold' },
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 31, 36, 40, 48, 56, 64, 72, 80, 96];

  const [selectedFont, setSelectedFont] = useState(initialPlacement.fontFamily || '"Noto Sans Devanagari", sans-serif');
  const [selectedStyle, setSelectedStyle] = useState(
    initialPlacement.fontStyle === 'italic'
      ? initialPlacement.fontWeight && initialPlacement.fontWeight >= 700
        ? 'Bold Italic'
        : 'Italic'
      : initialPlacement.fontWeight && initialPlacement.fontWeight >= 850
      ? 'Narrow Bold'
      : initialPlacement.fontWeight && initialPlacement.fontWeight >= 700
      ? 'Bold'
      : 'Regular',
  );
  const [selectedSize, setSelectedSize] = useState(initialPlacement.fontSize || 24);
  const [underline, setUnderline] = useState(initialPlacement.textDecoration === 'underline');
  const [strikeout, setStrikeout] = useState(Boolean(initialPlacement.strikeout));
  const [shadow, setShadow] = useState(Boolean(initialPlacement.shadow));
  const [uppercase, setUppercase] = useState(initialPlacement.textTransform === 'uppercase');
  const [script, setScript] = useState(initialPlacement.script || 'Devanagari');
  const [autoMarathi, setAutoMarathi] = useState(Boolean(initialPlacement.autoMarathi));

  const currentStyleObj = fontStyles.find((s) => s.label === selectedStyle) || fontStyles[0];

  function handleSave() {
    onSave({
      autoMarathi,
      fontFamily: selectedFont,
      fontSize: Number(selectedSize),
      fontStyle: currentStyleObj.fontStyle as 'normal' | 'italic',
      fontWeight: currentStyleObj.fontWeight,
      script,
      shadow,
      strikeout,
      textDecoration: underline ? 'underline' : 'none',
      textTransform: uppercase ? 'uppercase' : 'none',
    });
    onClose();
  }

  const samplePreviewText = applyAutoMarathiTranslation(sampleText, { autoMarathi, script });

  return (
    <div className="font-dialog-backdrop" onClick={onClose}>
      <div className="font-dialog-box" onClick={(e) => e.stopPropagation()}>
        <div className="font-dialog-header">
          <span>Font</span>
          <button onClick={onClose} type="button">×</button>
        </div>

        <div className="font-dialog-body">
          <div className="font-dialog-columns">
            <div className="font-col">
              <label>Font</label>
              <input value={selectedFont.replaceAll('"', '').split(',')[0]} onChange={(e) => setSelectedFont(e.target.value)} />
              <div className="font-col-list">
                {fonts.map((f) => (
                  <button
                    className={selectedFont === f.value ? 'selected' : ''}
                    key={f.label}
                    onClick={() => setSelectedFont(f.value)}
                    type="button"
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-col">
              <label>Font Style</label>
              <input value={selectedStyle} readOnly />
              <div className="font-col-list">
                {fontStyles.map((s) => (
                  <button
                    className={selectedStyle === s.label ? 'selected' : ''}
                    key={s.label}
                    onClick={() => setSelectedStyle(s.label)}
                    type="button"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="font-col">
              <label>Size</label>
              <input type="number" value={selectedSize} onChange={(e) => setSelectedSize(Number(e.target.value))} />
              <div className="font-col-list">
                {fontSizes.map((sz) => (
                  <button
                    className={selectedSize === sz ? 'selected' : ''}
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    type="button"
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <fieldset className="font-dialog-group">
            <legend>Effects</legend>
            <div className="effects-grid">
              <label><input type="checkbox" checked={strikeout} onChange={(e) => setStrikeout(e.target.checked)} /> Strikeout</label>
              <label><input type="checkbox" checked={underline} onChange={(e) => setUnderline(e.target.checked)} /> Underline</label>
              <label><input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} /> Shadow</label>
              <label><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase</label>
            </div>
          </fieldset>

          <fieldset className="font-dialog-group">
            <legend>Sample</legend>
            <div
              className="sample-box"
              style={{
                color: '#111',
                fontFamily: selectedFont,
                fontSize: `${Math.min(32, selectedSize)}px`,
                fontStyle: currentStyleObj.fontStyle,
                fontWeight: currentStyleObj.fontWeight,
                textDecoration: `${underline ? 'underline ' : ''}${strikeout ? 'line-through' : ''}`.trim() || 'none',
                textShadow: shadow ? '0 2px 4px rgba(0,0,0,0.35)' : 'none',
                textTransform: uppercase ? 'uppercase' : 'none',
              }}
            >
              {samplePreviewText}
            </div>
          </fieldset>
        </div>

        <div className="font-dialog-footer">
          <div className="script-select">
            <label>Script:</label>
            <select value={script} onChange={(e) => setScript(e.target.value)}>
              <option value="Devanagari">Devanagari (Marathi)</option>
              <option value="Western">Western</option>
            </select>
            <label style={{ marginLeft: '10px', cursor: 'pointer' }}>
              <input type="checkbox" checked={autoMarathi} onChange={(e) => setAutoMarathi(e.target.checked)} /> Auto Marathi
            </label>
          </div>

          <div className="btn-group">
            <button className="primary-btn" onClick={handleSave} type="button">OK</button>
            <button onClick={onClose} type="button">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateView({
  activeForm,
  activeTemplate,
  language = 'en',
  latestTemplateVersion,
  onAddField,
  onPreviewChange,
  onSaveTemplate,
  templatePreview,
}: {
  activeForm: ActiveForm | null;
  activeTemplate?: Template;
  language?: Language;
  latestTemplateVersion?: Template['versions'][number];
  onAddField: (label: string, required?: boolean) => void;
  onPreviewChange: (url: string) => void;
  onSaveTemplate?: (placements: Record<string, TemplatePlacement>) => Promise<void> | void;
  templatePreview: string;
}) {
  type ResizeHandle = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';
  type FieldInteraction =
    | { fieldKey: string; origin: TemplatePlacement; startX: number; startY: number; type: 'move' }
    | { fieldKey: string; handle: ResizeHandle; origin: TemplatePlacement; startX: number; startY: number; type: 'resize' };

  const [fieldLabel, setFieldLabel] = useState('');
  const canvasWidth = latestTemplateVersion?.canvasWidth ?? 1328;
  const canvasHeight = latestTemplateVersion?.canvasHeight ?? 800;
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const fieldOptions = useMemo(
    () => [
      { key: 'slipNumber', label: 'Slip No.' },
      { key: 'createdAt', label: 'Date' },
      { key: 'contributorName', label: 'Name' },
      { key: 'contributorAddress', label: 'Address' },
      { key: 'amount', label: 'Amount' },
      { key: 'amountWords', label: 'Amount in Words' },
      { key: 'amountWordsMarathi', label: 'Amount in Words (Marathi)' },
      { key: 'shopName', label: 'Shop Name' },
      { key: 'contributorPhone', label: 'Mobile No.' },
      { key: 'paymentMode', label: 'Payment Mode' },
      { key: 'areaName', label: 'Area' },
      { key: 'collectorName', label: 'Collector Name' },
      { key: 'donorType', label: 'Donor Type' },
      { key: 'building_name', label: 'Building / Lane' },
      ...(activeForm?.customFields ?? []).map((field) => ({ key: field.key, label: field.label })),
    ],
    [activeForm?.customFields],
  );
  const [activeField, setActiveField] = useState('slipNumber');
  const [interaction, setInteraction] = useState<FieldInteraction | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [contextMenu, setContextMenu] = useState<{ fieldKey: string; x: number; y: number } | null>(null);
  const [fontModalFieldKey, setFontModalFieldKey] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [placements, setPlacements] = useState<Record<string, TemplatePlacement>>(() => {
    const backendPlacements = normalizeTemplatePlacements(latestTemplateVersion?.renderConfig?.fields);
    if (Object.keys(backendPlacements).length > 0) return backendPlacements;
    return {
      amount: {
        ...defaultPlacement(),
        color: '#111111',
        fontSize: 31,
        fontWeight: 900,
        height: 52,
        textAlign: 'left',
        width: 250,
        x: 720,
        y: 680,
      },
      building_name: {
        ...defaultPlacement(),
        color: '#111111',
        fontSize: 24,
        fontWeight: 700,
        height: 48,
        textAlign: 'left',
        width: 420,
        x: 715,
        y: 623,
      },
      contributorAddress: {
        ...defaultPlacement(),
        color: '#111111',
        fontSize: 27,
        fontWeight: 800,
        height: 70,
        textAlign: 'left',
        textWrap: 'wrap',
        width: 560,
        x: 715,
        y: 574,
      },
      contributorName: {
        ...defaultPlacement(),
        color: '#111111',
        fontSize: 30,
        fontWeight: 900,
        height: 58,
        textAlign: 'left',
        width: 610,
        x: 670,
        y: 515,
      },
      createdAt: {
        ...defaultPlacement(),
        color: '#111111',
        fontSize: 25,
        fontWeight: 800,
        height: 46,
        textAlign: 'center',
        width: 160,
        x: 1115,
        y: 455,
      },
      slipNumber: {
        ...defaultPlacement(),
        color: '#b62028',
        fontSize: 31,
        fontWeight: 900,
        height: 48,
        textAlign: 'left',
        width: 100,
        x: 648,
        y: 445,
      },
    };
  });
  const selectedPlacement = placements[activeField] ?? defaultPlacement();

  const latestTemplateBackground = latestTemplateVersion?.backgroundFileUrl;
  const latestTemplateFields = latestTemplateVersion?.renderConfig?.fields;

  useEffect(() => {
    const backendPlacements = normalizeTemplatePlacements(latestTemplateFields);
    if (Object.keys(backendPlacements).length > 0) {
      setPlacements(backendPlacements);
    }
    if (latestTemplateBackground) {
      onPreviewChange(resolveTemplateAssetUrl(latestTemplateBackground));
    }
  }, [latestTemplateBackground, latestTemplateFields, latestTemplateVersion?.id, onPreviewChange]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      if ((event.key === 'Delete' || event.key === 'Backspace') && placements[activeField]) {
        event.preventDefault();
        removePlacement(activeField);
      }
      if (event.key === 'Escape') setContextMenu(null);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeField, placements]);

  function pointFromClient(clientX: number, clientY: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: clamp(Math.round(((clientX - rect.left) / rect.width) * canvasWidth), 0, canvasWidth),
      y: clamp(Math.round(((clientY - rect.top) / rect.height) * canvasHeight), 0, canvasHeight),
    };
  }

  function updatePlacement(fieldKey: string, partial: Partial<TemplatePlacement>) {
    setPlacements((current) => ({
      ...current,
      [fieldKey]: {
        ...defaultPlacement(),
        ...current[fieldKey],
        ...partial,
      },
    }));
  }

  function placeActiveField(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if (event.target !== event.currentTarget) return;
    if (interaction) return;
    setContextMenu(null);
    const point = pointFromClient(event.clientX, event.clientY);
    const placement = placements[activeField] ?? defaultPlacement();
    updatePlacement(activeField, {
      x: clamp(point.x, 0, canvasWidth - placement.width),
      y: clamp(point.y, 0, canvasHeight - placement.height),
    });
  }

  function handleCanvasPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!interaction) return;
    event.preventDefault();
    const point = pointFromClient(event.clientX, event.clientY);
    const deltaX = point.x - interaction.startX;
    const deltaY = point.y - interaction.startY;
    const origin = interaction.origin;
    if (interaction.type === 'move') {
      updatePlacement(interaction.fieldKey, {
        x: clamp(origin.x + deltaX, 0, canvasWidth - origin.width),
        y: clamp(origin.y + deltaY, 0, canvasHeight - origin.height),
      });
      return;
    }

    let nextX = origin.x;
    let nextY = origin.y;
    let nextWidth = origin.width;
    let nextHeight = origin.height;
    if (interaction.handle.includes('e')) nextWidth = origin.width + deltaX;
    if (interaction.handle.includes('s')) nextHeight = origin.height + deltaY;
    if (interaction.handle.includes('w')) {
      nextX = origin.x + deltaX;
      nextWidth = origin.width - deltaX;
    }
    if (interaction.handle.includes('n')) {
      nextY = origin.y + deltaY;
      nextHeight = origin.height - deltaY;
    }
    nextWidth = clamp(nextWidth, 48, canvasWidth - nextX);
    nextHeight = clamp(nextHeight, 24, canvasHeight - nextY);
    nextX = clamp(nextX, 0, canvasWidth - nextWidth);
    nextY = clamp(nextY, 0, canvasHeight - nextHeight);
    updatePlacement(interaction.fieldKey, {
      height: nextHeight,
      width: nextWidth,
      x: nextX,
      y: nextY,
    });
  }

  function startMove(fieldKey: string, event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointFromClient(event.clientX, event.clientY);
    setActiveField(fieldKey);
    setContextMenu(null);
    setInteraction({
      fieldKey,
      origin: placements[fieldKey] ?? defaultPlacement(),
      startX: point.x,
      startY: point.y,
      type: 'move',
    });
  }

  function startResize(fieldKey: string, handle: ResizeHandle, event: PointerEvent<HTMLSpanElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointFromClient(event.clientX, event.clientY);
    setActiveField(fieldKey);
    setContextMenu(null);
    setInteraction({
      fieldKey,
      handle,
      origin: placements[fieldKey] ?? defaultPlacement(),
      startX: point.x,
      startY: point.y,
      type: 'resize',
    });
  }

  function removePlacement(fieldKey = activeField) {
    setPlacements((current) => {
      const next = { ...current };
      delete next[fieldKey];
      return next;
    });
    setContextMenu(null);
  }

  function duplicatePlacement(fieldKey = activeField) {
    const source = placements[fieldKey];
    if (!source) return;
    const duplicateKey = `${baseTemplateFieldKey(fieldKey)}_copy_${Date.now()}`;
    setPlacements((current) => ({
      ...current,
      [duplicateKey]: {
        ...source,
        x: source.x + 24,
        y: source.y + 24,
      },
    }));
    setActiveField(duplicateKey);
    setContextMenu(null);
  }

  function addTemplateField(fieldKey: string) {
    if (!placements[fieldKey]) {
      setActiveField(fieldKey);
      updatePlacement(fieldKey, defaultPlacement());
      return;
    }

    duplicatePlacement(fieldKey);
  }

  function bringPlacementForward(fieldKey = activeField) {
    const source = placements[fieldKey];
    if (!source) return;
    setPlacements((current) => {
      const next = { ...current };
      delete next[fieldKey];
      return { ...next, [fieldKey]: source };
    });
    setContextMenu(null);
  }

  function centerFieldOnSlip(fieldKey = activeField) {
    const source = placements[fieldKey] ?? defaultPlacement();
    updatePlacement(fieldKey, { x: Math.round((canvasWidth - source.width) / 2) });
    setContextMenu(null);
  }

  function fullWidthCenterField(fieldKey = activeField) {
    updatePlacement(fieldKey, {
      textAlign: 'center',
      width: canvasWidth - 80,
      x: 40,
    });
    setContextMenu(null);
  }

  function contextAction(fieldKey: string, action: string) {
    const source = placements[fieldKey] ?? defaultPlacement();
    const actions: Record<string, () => void> = {
      black: () => updatePlacement(fieldKey, { color: '#111111' }),
      bold: () => updatePlacement(fieldKey, { fontWeight: source.fontWeight >= 800 ? 500 : 900 }),
      border: () => updatePlacement(fieldKey, { borderColor: source.borderColor === 'transparent' ? '#ff4f0a' : 'transparent' }),
      capitalize: () => updatePlacement(fieldKey, { textTransform: source.textTransform === 'capitalize' ? 'none' : 'capitalize' }),
      center: () => updatePlacement(fieldKey, { textAlign: 'center' }),
      centerField: () => centerFieldOnSlip(fieldKey),
      delete: () => removePlacement(fieldKey),
      duplicate: () => duplicatePlacement(fieldKey),
      fontArial: () => updatePlacement(fieldKey, { fontFamily: 'Arial, sans-serif' }),
      fontDevanagari: () => updatePlacement(fieldKey, { fontFamily: '"Noto Sans Devanagari", Arial, sans-serif' }),
      fontGeorgia: () => updatePlacement(fieldKey, { fontFamily: 'Georgia, serif' }),
      fullWidth: () => fullWidthCenterField(fieldKey),
      grid: () => setShowGrid((value) => !value),
      italic: () => updatePlacement(fieldKey, { fontStyle: source.fontStyle === 'italic' ? 'normal' : 'italic' }),
      larger: () => updatePlacement(fieldKey, { fontSize: clamp(source.fontSize + 2, 8, 96) }),
      left: () => updatePlacement(fieldKey, { textAlign: 'left' }),
      orange: () => updatePlacement(fieldKey, { color: '#ff4f0a' }),
      red: () => updatePlacement(fieldKey, { color: '#b62028' }),
      resetRotate: () => updatePlacement(fieldKey, { rotate: 0 }),
      right: () => updatePlacement(fieldKey, { textAlign: 'right' }),
      rotateLeft: () => updatePlacement(fieldKey, { rotate: source.rotate - 5 }),
      rotateRight: () => updatePlacement(fieldKey, { rotate: source.rotate + 5 }),
      shadow: () => updatePlacement(fieldKey, { shadow: !source.shadow }),
      shrink: () => updatePlacement(fieldKey, { fontSize: clamp(source.fontSize - 2, 8, 96), textWrap: 'shrink' }),
      smaller: () => updatePlacement(fieldKey, { fontSize: clamp(source.fontSize - 2, 8, 96) }),
      splitHold: () => updatePlacement(fieldKey, { height: Math.max(source.height, source.fontSize * 2.7), textWrap: 'wrap' }),
      transparentBg: () => updatePlacement(fieldKey, { backgroundColor: 'transparent' }),
      underline: () => updatePlacement(fieldKey, { textDecoration: source.textDecoration === 'underline' ? 'none' : 'underline' }),
      uppercase: () => updatePlacement(fieldKey, { textTransform: source.textTransform === 'uppercase' ? 'none' : 'uppercase' }),
      whiteBg: () => updatePlacement(fieldKey, { backgroundColor: 'rgba(255, 255, 255, 0.78)' }),
      wrap: () => updatePlacement(fieldKey, { textWrap: source.textWrap === 'wrap' ? 'single' : 'wrap' }),
    };
    actions[action]?.();
  }

  async function handleSaveTemplate() {
    setSaveMessage('Saving...');
    try {
      await onSaveTemplate?.(placements);
      setSaveMessage('Saved');
    } catch (error) {
      setSaveMessage(error instanceof Error ? error.message : 'Save failed');
    }
    window.setTimeout(() => setSaveMessage(''), 2400);
  }

  return (
    <section className="template-grid">
      <div className="card template-stage">
        <div className="panel-title">
          <FileText size={22} />
          <div>
            <strong>{activeTemplate?.name ?? 'Vargani Receipt Template'}</strong>
            <span>
              {latestTemplateVersion
                ? `${latestTemplateVersion.canvasWidth} x ${latestTemplateVersion.canvasHeight}px active`
                : 'Upload and map fields over the slip'}
            </span>
          </div>
        </div>
        <div className="toolbar">
          <label className="upload-button">
            <Upload size={18} />
            {t(language, 'Upload Template')}
            <input
              accept="image/*"
              type="file"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const dataUrl = e.target?.result as string;
                    if (dataUrl) onPreviewChange(dataUrl);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          <button type="button"><SlidersHorizontal size={18} />{t(language, 'Slip Size')}</button>
          <button onClick={handleSaveTemplate} type="button"><CheckCircle2 size={18} />{t(language, 'Save Template')}</button>
          {saveMessage && <span className="template-save-toast"><CheckCircle2 size={16} />{t(language, saveMessage)}</span>}
        </div>
        <div className="template-canvas">
          <div
            className={`template-map-canvas ${showGrid ? 'show-grid' : ''}`}
            ref={canvasRef}
            onPointerDown={placeActiveField}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={() => setInteraction(null)}
            onPointerCancel={() => setInteraction(null)}
            onContextMenu={(event) => {
              event.preventDefault();
              setContextMenu(null);
            }}
            style={{ aspectRatio: `${canvasWidth} / ${canvasHeight}` }}
          >
            <img alt="Vargani slip template" src={templatePreview} />
            {Object.entries(placements).map(([key, placement]) => {
              const baseKey = baseTemplateFieldKey(key);
              const field = fieldOptions.find((item) => item.key === baseKey);
              const sampleValue = sampleFieldValue(baseKey, field?.label ?? baseKey);
              const fontSize =
                placement.textWrap === 'shrink' && sampleValue.length > 18
                  ? Math.max(10, placement.fontSize - Math.ceil((sampleValue.length - 18) / 3))
                  : placement.fontSize;
              return (
                <div
                  className={`field-anchor ${activeField === key ? 'active' : ''}`}
                  key={key}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    setActiveField(key);
                    setContextMenu({ fieldKey: key, x: event.clientX, y: event.clientY });
                  }}
                  onPointerDown={(event) => startMove(key, event)}
                  role="button"
                  style={{
                    alignItems: placement.textWrap === 'single' ? 'center' : 'flex-start',
                    backgroundColor: placement.backgroundColor,
                    borderColor: placement.borderColor,
                    borderRadius: `${placement.borderRadius}px`,
                    color: placement.color,
                    fontFamily: placement.fontFamily,
                    fontSize: `${fontSize}px`,
                    fontStyle: placement.fontStyle,
                    fontWeight: placement.fontWeight,
                    height: `${(placement.height / canvasHeight) * 100}%`,
                    left: `${(placement.x / canvasWidth) * 100}%`,
                    letterSpacing: `${placement.letterSpacing}px`,
                    lineHeight: placement.lineHeight,
                    opacity: placement.opacity,
                    padding: `${placement.padding}px`,
                    textDecoration: placement.textDecoration,
                    textAlign: placement.textAlign,
                    textShadow: placement.shadow ? '0 2px 4px rgba(0, 0, 0, 0.35)' : 'none',
                    textTransform: placement.textTransform,
                    top: `${(placement.y / canvasHeight) * 100}%`,
                    transform: `rotate(${placement.rotate}deg)`,
                    width: `${(placement.width / canvasWidth) * 100}%`,
                    whiteSpace: placement.textWrap === 'single' ? 'nowrap' : 'normal',
                    wordBreak: placement.textWrap === 'single' ? 'normal' : 'break-word',
                  }}
                  tabIndex={0}
                >
                  <span>{sampleValue}</span>
                  {activeField === key && (
                    <>
                      {(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as ResizeHandle[]).map((handle) => (
                        <span
                          aria-hidden="true"
                          className={`resize-handle handle-${handle}`}
                          key={handle}
                          onPointerDown={(event) => startResize(key, handle, event)}
                        />
                      ))}
                    </>
                  )}
                </div>
              );
            })}
            {contextMenu && (
              <div
                className="field-context-menu hierarchical"
                style={{
                  left: `${contextMenu.x}px`,
                  top: `${contextMenu.y}px`,
                }}
              >
                <div className="menu-item has-submenu">
                  <span>Image Properties</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { opacity: 0.8 }); setContextMenu(null); }} type="button">Opacity: 80%</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { opacity: 1 }); setContextMenu(null); }} type="button">Opacity: 100%</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { borderRadius: 12 }); setContextMenu(null); }} type="button">Rounded Corners (12px)</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { borderRadius: 0 }); setContextMenu(null); }} type="button">Square Corners (0px)</button>
                  </div>
                </div>

                <div className="menu-item has-submenu">
                  <span>Text Properties</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'larger'); setContextMenu(null); }} type="button">Increase Text Size</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'smaller'); setContextMenu(null); }} type="button">Reduce Text Size</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'bold'); setContextMenu(null); }} type="button">Bold / Normal</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'italic'); setContextMenu(null); }} type="button">Italic</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'underline'); setContextMenu(null); }} type="button">Underline</button>
                    <button onClick={() => { setFontModalFieldKey(contextMenu.fieldKey); setContextMenu(null); }} type="button">Font Dialog...</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { autoMarathi: !placements[contextMenu.fieldKey]?.autoMarathi }); setContextMenu(null); }} type="button">Auto Marathi Translation</button>
                  </div>
                </div>

                <div className="menu-item has-submenu">
                  <span>Background Properties</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'transparentBg'); setContextMenu(null); }} type="button">Transparent Background</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'whiteBg'); setContextMenu(null); }} type="button">White Background</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { backgroundColor: '#fff3d5' }); setContextMenu(null); }} type="button">Yellow Highlight Tint</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'border'); setContextMenu(null); }} type="button">Toggle Border</button>
                  </div>
                </div>

                <div className="menu-item has-submenu">
                  <span>Alignments</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'left'); setContextMenu(null); }} type="button">Align Left</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'center'); setContextMenu(null); }} type="button">Align Center</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'right'); setContextMenu(null); }} type="button">Align Right</button>
                  </div>
                </div>

                <button className="menu-item" onClick={() => { contextAction(contextMenu.fieldKey, 'grid'); setContextMenu(null); }} type="button">
                  <span>Grid View</span>
                </button>

                <div className="menu-divider" />

                <button className="menu-item" onClick={() => { contextAction(contextMenu.fieldKey, 'centerField'); setContextMenu(null); }} type="button">
                  <span>Center Field on Card</span>
                </button>

                <button className="menu-item" onClick={() => { contextAction(contextMenu.fieldKey, 'fullWidth'); setContextMenu(null); }} type="button">
                  <span>Full Width + Center Text</span>
                </button>

                <button
                  className="menu-item"
                  onClick={() => {
                    const current = placements[contextMenu.fieldKey] ?? defaultPlacement();
                    const input = window.prompt('Enter X, Y coordinates (e.g. 720, 680):', `${current.x}, ${current.y}`);
                    if (input) {
                      const [x, y] = input.split(',').map((val) => parseInt(val.trim(), 10));
                      if (!isNaN(x) && !isNaN(y)) {
                        updatePlacement(contextMenu.fieldKey, { x, y });
                      }
                    }
                    setContextMenu(null);
                  }}
                  type="button"
                >
                  <span>Set Text Axis (X, Y)</span>
                </button>

                <div className="menu-item has-submenu">
                  <span>Color</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'black'); setContextMenu(null); }} type="button">Black (#111111)</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'red'); setContextMenu(null); }} type="button">Receipt Red (#b62028)</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'orange'); setContextMenu(null); }} type="button">Orange (#ff4f0a)</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { color: '#059669' }); setContextMenu(null); }} type="button">Green (#059669)</button>
                    <button onClick={() => { updatePlacement(contextMenu.fieldKey, { color: '#2563eb' }); setContextMenu(null); }} type="button">Blue (#2563eb)</button>
                  </div>
                </div>

                <div className="menu-item has-submenu">
                  <span>Rotate</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'rotateLeft'); setContextMenu(null); }} type="button">Rotate -5°</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'rotateRight'); setContextMenu(null); }} type="button">Rotate +5°</button>
                    <button onClick={() => { contextAction(contextMenu.fieldKey, 'resetRotate'); setContextMenu(null); }} type="button">Reset 0°</button>
                  </div>
                </div>

                <button
                  className="menu-item highlighted"
                  onClick={() => {
                    setFontModalFieldKey(contextMenu.fieldKey);
                    setContextMenu(null);
                  }}
                  type="button"
                >
                  <span>Font (Font Dialog)...</span>
                </button>

                <div className="menu-divider" />

                <button className="menu-item" onClick={() => { contextAction(contextMenu.fieldKey, 'splitHold'); setContextMenu(null); }} type="button">
                  <span>Split Hold Size</span>
                </button>

                <button className="menu-item" onClick={() => { contextAction(contextMenu.fieldKey, 'wrap'); setContextMenu(null); }} type="button">
                  <span>WordWrap / Rotate Reduce Font Size</span>
                </button>

                <div className="menu-item has-submenu">
                  <span>Layer</span>
                  <ChevronRight size={14} />
                  <div className="submenu">
                    <button onClick={() => { removePlacement(contextMenu.fieldKey); setContextMenu(null); }} type="button">Delete Field</button>
                    <button onClick={() => { duplicatePlacement(contextMenu.fieldKey); setContextMenu(null); }} type="button">Duplicate Field</button>
                    <button onClick={() => { bringPlacementForward(contextMenu.fieldKey); setContextMenu(null); }} type="button">Bring To Front</button>
                  </div>
                </div>

                <button
                  className="menu-item marathi-item"
                  onClick={() => {
                    updatePlacement(contextMenu.fieldKey, { autoMarathi: !placements[contextMenu.fieldKey]?.autoMarathi });
                    setContextMenu(null);
                  }}
                  type="button"
                >
                  <span>{placements[contextMenu.fieldKey]?.autoMarathi ? '✓ Marathi Translation ON' : 'Auto Marathi Translation (मराठी)'}</span>
                </button>
              </div>
            )}

            {fontModalFieldKey && (
              <FontDialogModal
                initialPlacement={placements[fontModalFieldKey] ?? defaultPlacement()}
                onClose={() => setFontModalFieldKey(null)}
                onSave={(updated) => updatePlacement(fontModalFieldKey, updated)}
                sampleText={sampleFieldValue(
                  baseTemplateFieldKey(fontModalFieldKey),
                  fieldOptions.find((f) => f.key === baseTemplateFieldKey(fontModalFieldKey))?.label ?? baseTemplateFieldKey(fontModalFieldKey),
                )}
              />
            )}
          </div>
        </div>
      </div>
      <aside className="card settings-panel">
        <div className="template-settings">
          <strong>{t(language, 'Slip Settings')}</strong>
          <label>
            {t(language, 'Template Size')}
            <select defaultValue="landscape">
              <option value="landscape">Landscape Vargani Slip</option>
              <option value="portrait">Portrait Receipt</option>
              <option value="custom">Custom Size</option>
            </select>
          </label>
          <div className="mini-grid">
            <label>Width<input defaultValue="1328" /></label>
            <label>Height<input defaultValue="800" /></label>
          </div>
          <div className="mini-grid">
            <label>DPI<select defaultValue="300"><option value="300">300 DPI Standard</option><option value="150">150 DPI Preview</option></select></label>
            <label>Bleed (mm)<input defaultValue="1" /></label>
          </div>
        </div>
        <div className="panel-title">
          <Settings size={22} />
          <div>
            <strong>{t(language, 'Field Mapping')}</strong>
            <span>{t(language, 'Place boxes exactly on printed slip labels.')}</span>
          </div>
        </div>
        <div className="field-pills">
          {fieldOptions.map((field) => (
            <button
              className={baseTemplateFieldKey(activeField) === field.key ? 'active' : ''}
              key={field.key}
              onClick={() => {
                addTemplateField(field.key);
              }}
              type="button"
            >
              + {field.label}
            </button>
          ))}
        </div>
        <div className="template-settings">
          <strong>{t(language, 'Selected Field')}</strong>
          <div className="mini-grid">
            <label>X<input type="number" value={selectedPlacement.x} onChange={(event) => updatePlacement(activeField, { x: Number(event.target.value) })} /></label>
            <label>Y<input type="number" value={selectedPlacement.y} onChange={(event) => updatePlacement(activeField, { y: Number(event.target.value) })} /></label>
            <label>Width<input type="number" value={selectedPlacement.width} onChange={(event) => updatePlacement(activeField, { width: Number(event.target.value) })} /></label>
            <label>Height<input type="number" value={selectedPlacement.height} onChange={(event) => updatePlacement(activeField, { height: Number(event.target.value) })} /></label>
          </div>
          <div className="mini-grid">
            <label>Font Size<input type="number" value={selectedPlacement.fontSize} onChange={(event) => updatePlacement(activeField, { fontSize: Number(event.target.value) })} /></label>
            <label>Align<select value={selectedPlacement.textAlign} onChange={(event) => updatePlacement(activeField, { textAlign: event.target.value as TextAlign })}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
          </div>
          <label>Font Family<select value={selectedPlacement.fontFamily} onChange={(event) => updatePlacement(activeField, { fontFamily: event.target.value })}><option value="Arial, sans-serif">Arial</option><option value='"Noto Sans Devanagari", Arial, sans-serif'>Noto Sans Devanagari</option><option value="Inter, Arial, sans-serif">Inter</option><option value="Georgia, serif">Serif</option><option value='"Arial Narrow", Arial, sans-serif'>Arial Narrow</option></select></label>
          <div className="mini-grid">
            <label>Weight<select value={selectedPlacement.fontWeight} onChange={(event) => updatePlacement(activeField, { fontWeight: Number(event.target.value) })}><option value={400}>Regular</option><option value={700}>Bold</option><option value={800}>Extra Bold</option><option value={900}>Black</option></select></label>
            <label>Wrap<select value={selectedPlacement.textWrap} onChange={(event) => updatePlacement(activeField, { textWrap: event.target.value as TextWrapMode })}><option value="single">Single line</option><option value="wrap">Word wrap</option><option value="shrink">Auto reduce</option></select></label>
          </div>
          <div className="field-style-buttons">
            <button className={selectedPlacement.fontWeight >= 800 ? 'active' : ''} onClick={() => contextAction(activeField, 'bold')} type="button">B</button>
            <button className={selectedPlacement.fontStyle === 'italic' ? 'active' : ''} onClick={() => contextAction(activeField, 'italic')} type="button">I</button>
            <button className={selectedPlacement.textDecoration === 'underline' ? 'active' : ''} onClick={() => contextAction(activeField, 'underline')} type="button">U</button>
            <button className={selectedPlacement.shadow ? 'active' : ''} onClick={() => contextAction(activeField, 'shadow')} type="button">Shadow</button>
          </div>
          <div className="mini-grid">
            <label>Text Color<input type="color" value={selectedPlacement.color} onChange={(event) => updatePlacement(activeField, { color: event.target.value })} /></label>
            <label>Background<input type="color" value={toColorInput(selectedPlacement.backgroundColor)} onChange={(event) => updatePlacement(activeField, { backgroundColor: event.target.value })} /></label>
          </div>
          <div className="mini-grid">
            <label>Border Color<input type="color" value={toColorInput(selectedPlacement.borderColor)} onChange={(event) => updatePlacement(activeField, { borderColor: event.target.value })} /></label>
            <label>Radius<input type="number" value={selectedPlacement.borderRadius} onChange={(event) => updatePlacement(activeField, { borderRadius: Number(event.target.value) })} /></label>
          </div>
          <div className="mini-grid">
            <label>Line Height<input step="0.05" type="number" value={selectedPlacement.lineHeight} onChange={(event) => updatePlacement(activeField, { lineHeight: Number(event.target.value) })} /></label>
            <label>Letter Space<input type="number" value={selectedPlacement.letterSpacing} onChange={(event) => updatePlacement(activeField, { letterSpacing: Number(event.target.value) })} /></label>
            <label>Rotate<input type="number" value={selectedPlacement.rotate} onChange={(event) => updatePlacement(activeField, { rotate: Number(event.target.value) })} /></label>
            <label>Padding<input type="number" value={selectedPlacement.padding} onChange={(event) => updatePlacement(activeField, { padding: Number(event.target.value) })} /></label>
          </div>
          <div className="template-action-row wide">
            <button disabled={!placements[activeField]} onClick={() => centerFieldOnSlip(activeField)} type="button">Center Field on Slip</button>
            <button disabled={!placements[activeField]} onClick={() => fullWidthCenterField(activeField)} type="button">Full Width + Center Text</button>
          </div>
          <div className="template-action-row">
            <button disabled={!placements[activeField]} onClick={() => removePlacement(activeField)} type="button">Delete Field</button>
            <button disabled={!placements[activeField]} onClick={() => duplicatePlacement(activeField)} type="button">Duplicate</button>
          </div>
        </div>
        <div className="template-settings layers-panel">
          <strong>Layers ({Object.keys(placements).length})</strong>
          {Object.entries(placements).reverse().map(([key]) => {
            return (
              <div className={activeField === key ? 'layer-row active' : 'layer-row'} key={key}>
                <button onClick={() => setActiveField(key)} type="button">{templateFieldLabel(key, fieldOptions, placements)}</button>
                <button onClick={() => removePlacement(key)} type="button">Delete</button>
              </div>
            );
          })}
        </div>
        <div className="add-field">
          <strong>Add Custom Field</strong>
          <input value={fieldLabel} onChange={(event) => setFieldLabel(event.target.value)} placeholder="e.g. Building / Lane" />
          <button onClick={() => { void onAddField(fieldLabel, true); setFieldLabel(''); }} type="button">
            <Plus size={18} />Add
          </button>
        </div>
      </aside>
    </section>
  );
}

function Stat({ icon, label, note, value }: { icon: ReactNode; label: string; note: string; value: string }) {
  return (
    <article className="stat">
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="status-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function defaultPlacement(): TemplatePlacement {
  return {
    backgroundColor: 'rgba(255, 255, 255, 0.78)',
    borderColor: '#ff4f0a',
    borderRadius: 6,
    color: '#111111',
    fontFamily: 'Arial, sans-serif',
    fontSize: 28,
    fontStyle: 'normal',
    fontWeight: 800,
    height: 48,
    letterSpacing: 0,
    lineHeight: 1.15,
    opacity: 1,
    padding: 5,
    rotate: 0,
    shadow: false,
    textAlign: 'left',
    textDecoration: 'none',
    textTransform: 'none',
    textWrap: 'single',
    width: 280,
    x: 120,
    y: 120,
  };
}

function normalizeCssColor(value?: string) {
  return (value ?? '').toLowerCase().replace(/\s+/g, '');
}

function shouldPrintFieldBackground(value?: string) {
  const color = normalizeCssColor(value);
  return Boolean(color) && color !== 'transparent' && color !== 'rgba(255,255,255,0.78)';
}

function shouldPrintFieldBorder(value?: string) {
  const color = normalizeCssColor(value);
  return Boolean(color) && color !== 'transparent' && color !== '#ff4f0a';
}

function baseTemplateFieldKey(key: string) {
  return key.replace(/_copy_\d+$/, '');
}

function templateFieldLabel(
  key: string,
  fieldOptions: Array<{ key: string; label: string }>,
  placements: Record<string, TemplatePlacement>,
) {
  const baseKey = baseTemplateFieldKey(key);
  const baseLabel = fieldOptions.find((field) => field.key === baseKey)?.label ?? baseKey;
  const sameFieldKeys = Object.keys(placements).filter((fieldKey) => baseTemplateFieldKey(fieldKey) === baseKey);
  const index = sameFieldKeys.indexOf(key);
  return index > 0 ? `${baseLabel} ${index + 1}` : baseLabel;
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const drawWidth = imageRatio > canvasRatio ? canvasWidth : canvasHeight * imageRatio;
  const drawHeight = imageRatio > canvasRatio ? canvasWidth / imageRatio : canvasHeight;
  const drawX = (canvasWidth - drawWidth) / 2;
  const drawY = (canvasHeight - drawHeight) / 2;
  ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
}

function transformTemplateText(text: string, placement: TemplatePlacement) {
  if (placement.textTransform === 'uppercase') return text.toUpperCase();
  if (placement.textTransform === 'capitalize') {
    return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  return text;
}

function drawCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
) {
  if (!letterSpacing) {
    ctx.fillText(text, x, y);
    return;
  }

  const chars = Array.from(text);
  const textWidth = chars.reduce((sum, char) => sum + ctx.measureText(char).width, 0) + letterSpacing * Math.max(0, chars.length - 1);
  let cursor = x;
  if (ctx.textAlign === 'center') {
    cursor = x - textWidth / 2;
  } else if (ctx.textAlign === 'right') {
    cursor = x - textWidth;
  }

  chars.forEach((char) => {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + letterSpacing;
  });
}

function drawWrappedCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  maxHeight: number,
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
) {
  const lines = wrapCanvasText(ctx, text, maxWidth);
  const lineStep = fontSize * lineHeight;
  const maxLines = Math.max(1, Math.floor(maxHeight / lineStep));
  lines.slice(0, maxLines).forEach((line, index) => {
    drawCanvasText(ctx, line, x, y + index * lineStep, letterSpacing);
  });
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let currentLine = words[0];

  words.slice(1).forEach((word) => {
    const candidate = `${currentLine} ${word}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      currentLine = candidate;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });

  lines.push(currentLine);
  return lines;
}

function normalizeTemplatePlacements(
  fields?: Record<string, Partial<TemplatePlacement>>,
): Record<string, TemplatePlacement> {
  if (!fields || typeof fields !== 'object') return {};
  return Object.fromEntries(
    Object.entries(fields)
      .filter((entry): entry is [string, Partial<TemplatePlacement>] => Boolean(entry[1]) && typeof entry[1] === 'object')
      .map(([key, placement]) => [
        key,
        {
          ...defaultPlacement(),
          ...placement,
        },
      ]),
  );
}

function findActiveTemplateVersion(templates: Template[] = []) {
  return templates
    .flatMap((template) => template.versions)
    .find((version) => version.isActive);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function toColorInput(value: string) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  if (value === 'transparent') return '#ffffff';
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!match) return '#ffffff';
  return `#${[match[1], match[2], match[3]].map((part) => Number(part).toString(16).padStart(2, '0')).join('')}`;
}



function isSlipPaid(slip: Slip) {
  return (slip.status ?? 'ACTIVE').toUpperCase() !== 'PENDING';
}

function buildWhatsAppReceiptMessage(slip: Slip, receiptUrl = 'Digital receipt link is being generated.') {
  const shopLine = slip.shopName ? `दुकान / संस्था: ${slip.shopName}\n` : '';
  const areaLine = slip.areaName ? `परिसर: ${slip.areaName}\n` : '';

  return `॥ श्री गणेशाय नमः ॥ 🙏🐘

आदरणीय भक्तगण,

पुणे गणपती उत्सव परिवाराच्या वतीने आपल्या अमूल्य देणगीबद्दल मनःपूर्वक आभार! 🌺

आपण दिलेल्या देणगीची डिजिटल पावती या संदेशासोबत जोडलेली आहे. कृपया ती आपल्या नोंदीसाठी जतन करून ठेवा.

पावती क्रमांक: ${slip.slipNumber}
नाव: ${slip.contributorName}
${shopLine}${areaLine}रक्कम: ${money(Number(slip.amount))}
डिजिटल पावती: ${receiptUrl}

आपल्या सहकार्यामुळे श्रींचा उत्सव अधिक भक्तिमय, भव्य आणि यशस्वी होण्यासाठी मोलाची मदत होत आहे.

श्री गणराय आपल्या जीवनात सुख, समृद्धी, उत्तम आरोग्य आणि सर्व मनोकामना पूर्ण करो, हीच श्रीचरणी प्रार्थना. 🌸

📄 टीप: ही System Generated Digital Receipt असून यासाठी स्वतंत्र स्वाक्षरीची आवश्यकता नाही.

आपल्या प्रेम, विश्वास आणि सहकार्याबद्दल पुन्हा एकदा मनःपूर्वक धन्यवाद! 🙏

॥ गणपती बाप्पा मोरया ॥
मंगलमूर्ती मोरया! ❤️🌺

– पुणे गणपती उत्सव`;
}
async function copyShareMessage(slip: Slip, receiptUrl?: string) {
  const text = buildWhatsAppReceiptMessage(slip, receiptUrl);
  await navigator.clipboard?.writeText(text).catch(() => undefined);
  return text;
}

async function shareReceiptToWhatsApp(slip: Slip, phone?: string | null, targetWindow?: Window | null, receiptUrl?: string) {
  const text = await copyShareMessage(slip, receiptUrl);
  openWhatsAppForSlip(slip, phone, text, targetWindow);
}

function openWhatsAppForSlip(slip: Slip, phone?: string | null, preparedText?: string, targetWindow?: Window | null) {
  const text = preparedText ?? buildWhatsAppReceiptMessage(slip);
  const digits = normalizeIndianPhone(phone);
  const url = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  if (targetWindow) {
    targetWindow.location.href = url;
    targetWindow.focus();
    return;
  }
  window.open(url, '_blank', 'noopener,noreferrer');
}

function normalizeIndianPhone(phone?: string | null) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

function workspaceQueryKey(session: AuthSession) {
  return ['workspace-bootstrap', session.user.role, session.user.mandalId ?? 'owner', session.user.id];
}

function mapBackendMandal(
  mandal: DemoMandal & {
    contactName?: string | null;
    contactPhone?: string | null;
    logoUrl?: string | null;
    users?: MandalLoginUser[];
  },
): DemoMandal {
  return {
    _count: mandal._count,
    additionalMembers: mandal.additionalMembers ?? '',
    address: mandal.address ?? '',
    adhyakshName: mandal.contactName ?? mandal.adhyakshName ?? '',
    adminEmail: mandal.adminEmail,
    adminPassword: mandal.adminPassword,
    city: mandal.city ?? '',
    contactEmail: mandal.contactEmail ?? '',
    contactPhone: mandal.contactPhone ?? '',
    festivals: mandal.festivals ?? [],
    id: mandal.id,
    khajindarName: mandal.khajindarName ?? '',
    logoUrl: mandal.logoUrl ?? '',
    locality: mandal.locality ?? '',
    memberCount: String(mandal._count?.members ?? mandal.memberCount ?? 0),
    name: mandal.name,
    slug: mandal.slug,
    status: mandal.status,
    users: mandal.users ?? [],
  };
}

function money(value: number) {
  return new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(Number.isFinite(value) ? value : 0);
}

function formatLogTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { date: value.slice(0, 10), time: '' };
  }

  return {
    date: new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(date),
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'mandal';
}

function normalizeOptionalIndianPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`;
  return /^\+91[6-9]\d{9}$/.test(trimmed) ? trimmed : '';
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read selected file.'));
    reader.onload = () => resolve(String(reader.result || ''));
    reader.readAsDataURL(file);
  });
}

async function imageFileToCompressedDataUrl(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please upload an image file for mandal logo.');
  }

  const originalDataUrl = await fileToDataUrl(file);
  const image = await loadImageElement(originalDataUrl);
  const maxSide = 640;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height));
  const width = Math.max(1, Math.round((image.naturalWidth || image.width) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || image.height) * scale));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return originalDataUrl;
  ctx.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.82);
}

function loadImageElement(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not process mandal logo. Try a smaller JPG or PNG image.'));
    image.src = src;
  });
}

function absoluteAppUrl(pathOrUrl: string) {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, window.location.origin).toString();
}

function resolveTemplateAssetUrl(pathOrUrl: string) {
  const value = pathOrUrl?.trim() || TEMPLATE_IMAGE;
  if (value.startsWith('data:')) return value;
  if (!/^https?:\/\//.test(value)) return absoluteAppUrl(value);

  try {
    const url = new URL(value);
    const isLocalTemplateAsset =
      ['localhost', '127.0.0.1'].includes(url.hostname) && url.pathname.startsWith('/templates/');
    if (isLocalTemplateAsset) {
      return new URL(`${url.pathname}${url.search}`, window.location.origin).toString();
    }
  } catch {
    return value;
  }

  return value;
}

function mandalLoginUrl() {
  return `${window.location.origin}${window.location.pathname}${window.location.search}#/login`;
}

function generateTemporaryPassword() {
  return `Dv@${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
}
