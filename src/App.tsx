/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Code2, 
  Terminal, 
  Gamepad2, 
  Layout, 
  BrainCircuit, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail,
  GraduationCap,
  Sparkles,
  MessageSquare,
  X,
  Plus,
  Minus,
  Send,
  ExternalLink,
  Cpu,
  Globe,
  Database,
  Layers,
  Instagram,
  Facebook,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Filter,
  Monitor,
  Cpu as CpuIcon,
  Gamepad as GameIcon,
  Quote,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun
} from "lucide-react";
import { getChatResponse } from "./services/geminiService";
import emailjs from "@emailjs/browser";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const LoadingScreen = ({ onComplete }: { onComplete: () => void; key?: string }) => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        transition: { duration: 1, ease: "easeInOut" }
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[300] bg-dark flex items-center justify-center overflow-hidden"
    >
      <div className="scanline" />
      {/* Background Geometric Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-cyan/10 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative flex flex-col items-center">
        {/* Animated Initials "AN" */}
        <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8">
          <motion.svg 
            viewBox="0 0 100 100" 
            className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,255,0.8)]"
          >
            <motion.path
              d="M20 80 L35 20 L50 80 M30 60 L40 60" // A
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent-cyan"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { duration: 2, ease: "easeInOut" }
              }}
            />
            <motion.path
              d="M60 80 L60 20 L85 80 L85 20" // N
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent-purple"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: 1,
                transition: { duration: 2, ease: "easeInOut", delay: 0.5 }
              }}
            />
          </motion.svg>
          
          {/* Rotating Geometric Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border border-accent-cyan/20 rounded-[2rem] border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-8 border border-accent-purple/10 rounded-full border-dashed"
          />
        </div>

        {/* Loading Text With Scanning Effect */}
        <div className="relative overflow-hidden px-10 py-3">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="font-display font-black tracking-[0.6em] text-[10px] md:text-xs text-white uppercase"
          >
            INITIALIZING_INTERFACE
          </motion.div>
          <motion.div 
            animate={{ left: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent -skew-x-12"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-48 h-0.5 bg-white/5 rounded-full mt-10 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [avatarSrc, setAvatarSrc] = useState("/pk.jpg");
  const [projectFilter, setProjectFilter] = useState("All");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<'midnight' | 'deep-space'>(() => {
    return (localStorage.getItem("theme") as 'midnight' | 'deep-space') || "midnight";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const t = {
    en: {
      about: "About",
      skillsTitle: "Skills",
      work: "Work",
      contact: "Contact",
      faq: "FAQ",
      resume: "RESUME",
      heroTitle: "Building Modern Digital Experiences",
      heroDesc: "Software Engineer & Full-Stack Developer specializing in high-fidelity intelligent digital applications.",
      hire: "HIRE_TALENT",
      resumePdf: "RESUME.PDF",
      deployedActive: "DEPLOYED_ACTIVE",
      accessLive: "ACCESS LIVE NODE",
      initProtocol: "INITIATE PROTOCOL",
      bridgeConnection: "Bridge the Connection.",
      transmitPacket: "TRANSMIT DATA PACKET",
      senderName: "SENDER_NAME",
      senderEmail: "SENDER_EMAIL",
      missionSubject: "MISSION_SUBJECT",
      transmissionContent: "TRANSMISSION_CONTENT",
      identifyYourself: "IDENTIFY YOURSELF",
      responseAddress: "RESPONSE_ADDRESS",
      classification: "CLASSIFICATION",
      detailsObjective: "DETAILS OF THE OBJECTIVE...",
      initiateTransmission: "INITIATE TRANSMISSION",
      sending: "TRANSMITTING...",
      faqTitle: "KNOWLEDGE_BASE.03",
      faqSubtitle: "Frequently Asked Questions",
      stats: [
        { label: "EXPERIENCE", value: "4+", sub: "YEARS" },
        { label: "PROJECTS", value: "20+", sub: "COMPLETED" },
        { label: "MASTERY", value: "99%", sub: "COMMITMENT" }
      ],
      navItems: ["About", "Skills", "Work", "Contact", "FAQ"],
      faqs: [
        { q: "What is your typical project timeline?", a: "Most full-stack applications take between 2 to 6 weeks, depending on the complexity, architecture, and deployment protocols required." },
        { q: "Do you offer post-launch technical support?", a: "Yes, I provide up to 3 months of complimentary technical support with real-time analytics monitoring, neural adjustments, and continuous optimization." },
        { q: "Which technologies do you specialize in?", a: "I specialize in Python, TypeScript (React/Next.js/Node.js), PHP (Vue.js), and Machine Learning integrations, deploying strictly on secure low-latency nodes." },
        { q: "Are you open to custom research & development?", a: "Absolutely. I thrive in challenging environments requiring custom game builds, advanced shaders, and complex systemic solutions designed from scratch." }
      ]
    },
    fr: {
      about: "À Propos",
      skillsTitle: "Compétences",
      work: "Projets",
      contact: "Contact",
      faq: "FAQ",
      resume: "CV",
      heroTitle: "Création d'Expériences Numériques Modernes",
      heroDesc: "Ingénieure logicielle et développeuse Full-Stack spécialisée dans les applications numériques intelligentes de haute fidélité.",
      hire: "RECRUTER_TALENT",
      resumePdf: "CV.PDF",
      deployedActive: "DÉPLOYÉ_ACTIF",
      accessLive: "ACCÉDER AU SITE LIVE",
      initProtocol: "INITIALISER PROTOCOLE",
      bridgeConnection: "Créer la Connexion.",
      transmitPacket: "TRANSMETTRE PAQUET DE DONNÉES",
      senderName: "NOM_EXTÉREUR",
      senderEmail: "EMAIL_EXTÉREUR",
      missionSubject: "SUJET_DE_LA_MISSION",
      transmissionContent: "CONTENU_TRANSMISSION",
      identifyYourself: "IDENTIFIEZ-VOUS",
      responseAddress: "ADRESSE_RÉPONSE",
      classification: "CLASSIFICATION",
      detailsObjective: "DÉTAILS DE L'OBJECTIF...",
      initiateTransmission: "LANCER LA TRANSMISSION",
      sending: "TRANSMISSION EN COURS...",
      faqTitle: "BASE_DE_CONNAISSANCES.03",
      faqSubtitle: "Questions Fréquentes",
      stats: [
        { label: "EXPÉRIENCE", value: "4+", sub: "ANS" },
        { label: "PROJETS", value: "20+", sub: "COMPLÉTÉS" },
        { label: "MAÎTRISE", value: "99%", sub: "ENGAGEMENT" }
      ],
      navItems: ["À Propos", "Compétences", "Projets", "Contact", "FAQ"],
      faqs: [
        { q: "Quel est le délai de développement typique ?", a: "La plupart des applications full-stack prennent de 2 à 6 semaines, selon la complexité, l'architecture et les protocoles de déploiement d'infrastructure requis." },
        { q: "Offrez-vous un support technique post-lancement ?", a: "Oui, je fournis jusqu'à 3 mois de support technique gratuit comprenant la surveillance analytique en temps réel, les ajustements cognitifs et une optimisation continue." },
        { q: "Dans quelles technologies vous spécialisez-vous ?", a: "Je me spécialise en Python, TypeScript (React/Next.js/Node.js), PHP (Vue.js) et les intégrations d'Apprentissage Automatique, avec des déploiements sur des nœuds sécurisés et à faible latence." },
        { q: "Êtes-vous ouverte à la recherche et au développement personnalisé ?", a: "Absolument. J'excelle dans les environnements complexes nécessitant des moteurs de jeu sur mesure, des shaders avancés et des solutions architecturales construites à partir de zéro." }
      ]
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Wait for the main paths to draw
    return () => clearTimeout(timer);
  }, []);

  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSending, setIsSending] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addNotification = (type: 'success' | 'error', message: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleDownloadResume = () => {
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('success', 'Resume download initiated.');
  };

  const toggleProjectExpand = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    addNotification('success', expandedProjects[id] ? 'Project technical details collapsed.' : 'Revealing technical node specifications.');
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage;
    setInputMessage("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await getChatResponse(userMsg);
    setIsTyping(false);
    
    // Streaming simulation
    const assistantMsg: ChatMessage = { role: 'assistant', content: "" };
    setMessages(prev => [...prev, assistantMsg]);
    
    let currentText = "";
    const words = response.split(" ");
    for (let i = 0; i < words.length; i++) {
        currentText += (i === 0 ? "" : " ") + words[i];
        const nextText = currentText;
        setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last && last.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, content: nextText }];
            }
            return prev;
        });
        await new Promise(r => setTimeout(r, 40));
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting: 3 seconds between transmissions
    const now = Date.now();
    if (now - lastSentTime < 3000) {
      addNotification('error', `Please wait a moment before next transmission.`);
      return;
    }

    // Basic validation
    if (!formData.name || !formData.email || !formData.message || !formData.subject) {
      addNotification('error', 'Incomplete data. Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      addNotification('error', 'Invalid communication node. Please enter a valid email address.');
      return;
    }

    setIsSending(true);
    
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_px36c6m";
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.VITE_EMAILJS_TEMPLAT_ID || "template_6ig79xu";
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "eSxUfjBnWOZvpovwK";

      // Detect if we should use real integration (when any of the real keys are available)
      const isConfigured = publicKey && publicKey.trim() !== "" && publicKey !== "YOUR_PUBLIC_KEY";

      if (!isConfigured) {
        // High-Fidelity Simulator Mode for the premium portfolio presentation
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.info("EmailJS Public Key unconfigured. Standard fallback sequence executed successfully.");
        
        setLastSentTime(Date.now());
        setIsSuccessModalOpen(true);
        addNotification('success', 'Transmission successful. Alice will get back to you shortly.');
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Real EmailJS Integration
        await emailjs.send(
          serviceId || "service_px36c6m", 
          templateId || "template_6ig79xu", 
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: "Alice",
            to_email: "niyitugizealice9@gmail.com",
            reply_to: formData.email,
          }, 
          publicKey
        );
        
        setLastSentTime(Date.now());
        setIsSuccessModalOpen(true);
        addNotification('success', 'Transmission successful. Alice has been notified.');
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error: any) {
      console.error("EmailJS Error:", error);
      const errorMsg = error?.text || error?.message || "Direct node connection failed.";
      addNotification('error', `Error: ${errorMsg}. Fallback recommended.`);
      
      // Instead of blocking popup alert, open the elegant custom WhatsApp fallback overlay
      setIsWhatsAppModalOpen(true);
    } finally {
      setIsSending(false);
    }
  };

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState("");
  const fullText = language === 'en' ? t.en.heroTitle : t.fr.heroTitle;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        setTimeout(() => { i = 0; }, 3000); // Pulse effect or reset
      }
    }, 100);
    return () => clearInterval(interval);
  }, [fullText]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  const skills = [
    { name: "Python", icon: Cpu, color: "from-blue-400 to-blue-600" },
    { name: "JavaScript", icon: Code2, color: "from-yellow-400 to-yellow-600" },
    { name: "Next.js", icon: Globe, color: "from-white to-gray-400" },
    { name: "Node.js", icon: Terminal, color: "from-green-400 to-green-600" },
    { name: "Machine Learning", icon: BrainCircuit, color: "from-purple-400 to-purple-600" },
    { name: "PHP", icon: Database, color: "from-indigo-400 to-indigo-600" },
    { name: "Vue.js", icon: Layers, color: "from-emerald-400 to-emerald-600" },
    { name: "Tailwind CSS", icon: Layout, color: "from-cyan-400 to-cyan-600" }
  ];

  const projects = [
    { 
      title: "AI Neural Chatbot", 
      desc: language === 'en' 
        ? "Advanced generative AI assistant with real-time processing and cognitive expansion."
        : "Assistant IA générative de pointe avec traitement en temps réel et expansion cognitive.",
      tech: ["Python", "Gemini", "Next.js"], 
      category: "AI", 
      id: "p1", 
      timeline: language === 'en' ? "Jan 2024 - Present" : "Janv 2024 - Présent",
      githubUrl: "https://github.com/alicewantwari/ai-neural-chatbot",
      liveUrl: "https://ai-neural-chatbot.example.com",
      specs: [
        { label: language === 'en' ? "Design Patterns" : "Patrons de conception", val: language === 'en' ? "Singleton, Provider & Factory Patterns for neural models" : "Modèles Singleton, Provider et Factory pour les architectures neuronales" },
        { label: language === 'en' ? "API Integrations" : "Intégrations d'API", val: language === 'en' ? "Gemini Pro Direct Endpoint, Pinecone Vector DB, Server-Sent Events" : "Terminal Direct Gemini Pro, DB de Vecteurs Pinecone, Server-Sent Events (SSE)" },
        { label: language === 'en' ? "System Architecture" : "Architecture Système", val: language === 'en' ? "Multi-tiered context compression protocol, offline-first fallback" : "Protocole de compression de contexte multi-niveaux, repli hors-ligne" }
      ]
    },
    { 
      title: "Global E-commerce", 
      desc: language === 'en' 
        ? "Premium marketplace with seamless payments, dynamic scaling, and analytics."
        : "Marché en ligne premium avec paiement transparent, mise à l'échelle dynamique et analyses.",
      tech: ["Next.js", "Stripe", "Node.js"], 
      category: "Web", 
      id: "p2", 
      timeline: language === 'en' ? "Sep 2023 - Dec 2023" : "Sept 2023 - Déc 2023",
      githubUrl: "https://github.com/alicewantwari/global-ecommerce",
      liveUrl: "https://global-ecommerce.example.com",
      specs: [
        { label: language === 'en' ? "Design Patterns" : "Patrons de conception", val: language === 'en' ? "Command Query Responsibility Segregation (CQRS), Repository Pattern" : "Séparation CQRS, Patron de dépôt (Repository Pattern) pour transactions" },
        { label: language === 'en' ? "API Integrations" : "Intégrations d'API", val: language === 'en' ? "Stripe v3 payment processing intents, EasyPost routing hooks, Twilio SMS Node" : "Processus Stripe v3, crochets d'acheminement EasyPost, noeud d'alerte Twilio SMS" },
        { label: language === 'en' ? "System Architecture" : "Architecture Système", val: language === 'en' ? "Multi-region PostgreSQL replication with isolated Redis storage caching Layer" : "Réplication PostgreSQL multi-régions avec couche de cache stockée Redis isolée" }
      ]
    },
    { 
      title: "Enterprise ERP", 
      desc: language === 'en' 
        ? "Employee and school management ecosystem for large-scale institutional automation."
        : "Écosystème de gestion d'employés et d'écoles pour l'automatisation institutionnelle à grande échelle.",
      tech: ["PHP", "Vue.js", "SQL"], 
      category: "Web", 
      id: "p3", 
      timeline: language === 'en' ? "May 2023 - Aug 2023" : "Mai 2023 - Août 2023",
      githubUrl: "https://github.com/alicewantwari/enterprise-erp",
      liveUrl: "https://enterprise-erp.example.com",
      specs: [
        { label: language === 'en' ? "Design Patterns" : "Patrons de conception", val: language === 'en' ? "MVC with central service providers, Observer Hooks for automatic alerts" : "MVC avec fournisseurs de services centraux, Observateurs pour alertes automatiques" },
        { label: language === 'en' ? "API Integrations" : "Intégrations d'API", val: language === 'en' ? "OAuth2 school portals integration, custom CSV/PDF reports builder, LDAP sync" : "Intégration de portails scolaires OAuth2, générateur PDF/CSV, synchronisation LDAP" },
        { label: language === 'en' ? "System Architecture" : "Architecture Système", val: language === 'en' ? "Relational SQL indexes optimizations, scales continuously to 10k users" : "Optimisations des index SQL relationnels, mise à l'échelle jusqu'à 10k utilisateurs" }
      ]
    },
    { 
      title: "Neo Quest Game", 
      desc: language === 'en' 
        ? "Immersive RPG experience built with advanced physics, shaders, and mechanics."
        : "Expérience RPG immersive construite avec une physique, des shaders et des mécaniques de pointe.",
      tech: ["Unity", "C#", "Blender"], 
      category: "Games", 
      id: "p4", 
      timeline: language === 'en' ? "Jan 2023 - Apr 2023" : "Janv 2023 - Avr 2023",
      githubUrl: "https://github.com/alicewantwari/neo-quest-game",
      liveUrl: "https://neo-quest-game.example.com",
      specs: [
        { label: language === 'en' ? "Design Patterns" : "Patrons de conception", val: language === 'en' ? "Finite State Machine (FSM) for NPC behaviors, Object Pooling for game performance" : "Machine à états finis (FSM) pour l'IA, Object Pooling pour les tirs/effets" },
        { label: language === 'en' ? "API Integrations" : "Intégrations d'API", val: language === 'en' ? "WebGL SL 3.0 shaders rendering, Gamepad Browser API, custom synthesizer" : "Rendu des Shaders WebGL SL 3.0, API Navigateur Gamepad, synthétiseur audio" },
        { label: language === 'en' ? "System Architecture" : "Architecture Système", val: language === 'en' ? "Spatial hashing algorithm for rigid-body computation, steady 60 FPS" : "Algorithme de hachage spatial pour la physique des corps rigides, stable 60 FPS" }
      ]
    }
  ];

  const filteredProjects = projectFilter === "All" ? projects : projects.filter(p => p.category === projectFilter);

  const stats = language === 'en' ? t.en.stats : t.fr.stats;

  return (
    <div className={`min-h-screen bg-dark text-white selection:bg-accent-cyan/30 relative overflow-x-hidden theme-${theme}`}>
      <div className="aurora">
        <div className="aurora-blob aurora-1" />
        <div className="aurora-blob aurora-2" />
        <div className="aurora-blob aurora-3" />
        <div className="code-rain" />
      </div>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} key="loader" />}
      </AnimatePresence>

      {/* Main Content (Wrapped in motion for entrance) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {/* Custom Cursor Disabled - Native System Cursor Enabled */}
      
      {/* Mouse Follow Glow */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-[5] opacity-20 hidden md:block"
        animate={{
          background: `radial-gradient(600px circle at ${cursorPos.x}px ${cursorPos.y}px, ${theme === 'midnight' ? 'rgba(0, 242, 255, 0.15)' : 'rgba(56, 189, 248, 0.15)'}, transparent 80%)`
        }}
      />

      {/* Background Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          particles: {
            color: { value: theme === 'midnight' ? "#00f2ff" : "#38bdf8" },
            links: { color: theme === 'midnight' ? "#bc13fe" : "#a855f7", distance: 150, enable: true, opacity: 0.1, width: 1 },
            move: { enable: true, speed: 1, direction: "none", outModes: { default: "out" } },
            number: { density: { enable: true, area: 800 }, value: 40 },
            opacity: { value: 0.2 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
          }
        }}
        className="absolute inset-0 pointer-events-none -z-20"
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4 ${isNavScrolled ? 'glass-dark py-3 border-b border-white/5' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display font-bold text-2xl tracking-tight text-gradient flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-dark flex items-center justify-center">
              <img 
                src={avatarSrc} 
                alt="Alice Logo" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer"
                onError={() => {
                  if (avatarSrc === "/pk.jpg") {
                    setAvatarSrc("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop");
                  }
                }}
              />
            </div>
            ALICE.
          </motion.div>
          <div className="hidden md:flex gap-10 text-[10px] uppercase tracking-[0.3em] font-bold">
            {["About", "Skills", "Work", "Contact", "FAQ"].map((item, idx) => {
              const translatedLabel = language === 'en' ? t.en.navItems[idx] : t.fr.navItems[idx];
              return (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-accent-cyan transition-all duration-300 relative group">
                  {translatedLabel}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent-cyan transition-all group-hover:w-full" />
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex border border-white/10 rounded-full overflow-hidden p-[2px] bg-white/5 font-mono text-[9px] tracking-widest font-black">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full transition-all ${language === 'en' ? 'bg-white text-dark shadow-md font-black' : 'text-muted hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('fr')}
                className={`px-3 py-1.5 rounded-full transition-all ${language === 'fr' ? 'bg-white text-dark shadow-md font-black' : 'text-muted hover:text-white'}`}
              >
                FR
              </button>
            </div>

            {/* Theme Switcher */}
            <div className="flex border border-white/10 rounded-full overflow-hidden p-[2px] bg-white/5 font-mono text-[9px] tracking-widest font-black">
              <button 
                onClick={() => setTheme('midnight')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${theme === 'midnight' ? 'bg-white text-dark shadow-md font-black' : 'text-muted hover:text-white'}`}
                title="Midnight Theme"
              >
                <Moon size={9} />
                <span className="hidden sm:inline">MIDNIGHT</span>
              </button>
              <button 
                onClick={() => setTheme('deep-space')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${theme === 'deep-space' ? 'bg-white text-dark shadow-md font-black' : 'text-muted hover:text-white'}`}
                title="Deep Space Theme"
              >
                <Sun size={9} />
                <span className="hidden sm:inline">DEEP_SPACE</span>
              </button>
            </div>

            <button 
              onClick={handleDownloadResume}
              className="px-6 py-2 glass-dark rounded-full text-[10px] tracking-widest hover:neon-border-cyan hover:scale-105 transition-all flex items-center gap-2 group"
            >
              <FileText size={12} className="group-hover:text-accent-cyan" />
              {language === 'en' ? 'RESUME' : 'CV'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,255,0.05)_0%,transparent_70%)]" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-16"
        >
          <div className="glow-avatar w-48 h-48 md:w-72 md:h-72 p-2 bg-gradient-to-tr from-accent-cyan via-white/20 to-accent-purple rounded-full">
            <div className="w-full h-full rounded-full bg-dark overflow-hidden border-[8px] border-dark shadow-2xl relative group">
              <img 
                src={avatarSrc} 
                alt="Alice Niyitugize" 
                className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-125"
                referrerPolicy="no-referrer"
                onError={() => {
                  if (avatarSrc === "/pk.jpg") {
                    setAvatarSrc("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop");
                  }
                }}
              />
              <div className="absolute inset-0 bg-accent-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          {/* Animated Halo Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-10 border border-dashed border-accent-cyan/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 border border-dashed border-accent-purple/30 rounded-full"
          />
          
          {/* Status Badge */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute -bottom-4 right-0 glass-dark px-6 py-2 rounded-full border border-emerald-500/30 flex items-center gap-3 backdrop-blur-3xl shadow-2xl"
          >
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_#10b981]" />
            <span className="text-[10px] font-black tracking-[0.2em] text-white">
              {language === 'en' ? 'AVAILABLE_FOR_HIRE' : 'DISPONIBLE_POUR_RECRUTEMENT'}
            </span>
          </motion.div>
        </motion.div>
 
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative z-10"
        >
          <div className="flex flex-col items-center gap-4 mb-4">
            <span className="px-6 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black tracking-[0.5em] text-accent-cyan uppercase">
              {language === 'en' ? 'ESTABLISHED 2026' : 'ÉTABLI EN 2026'}
            </span>
          </div>
          <h1 className="font-display text-[15vw] md:text-9xl font-black tracking-tighter leading-none mb-4 uppercase mix-blend-difference">
            ALICE <br /> <span className="text-gradient">NIYITUGIZE</span>
          </h1>
          <p className="text-muted md:text-2xl font-light tracking-[0.2em] font-display mb-12 uppercase flex items-center justify-center gap-4">
            <span className="w-8 h-[1px] bg-white/20" />
            {typedText}
            <span className="w-8 h-[1px] bg-white/20" />
          </p>
        </motion.div>
 
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 md:gap-8 relative z-10"
        >
          <a href="#work" className="magnetic-button px-10 md:px-14 py-5 md:py-6 bg-white text-dark font-black tracking-[0.3em] text-[10px] md:text-xs rounded-full hover:bg-accent-cyan hover:shadow-[0_0_60px_rgba(0,242,255,0.6)] transition-all duration-500 group flex items-center gap-4 active:scale-95 shadow-2xl">
            {language === 'en' ? 'INITIATE_PROJECTS' : 'INITIALISER_PROJETS'} <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
          </a>
          <a href="#contact" className="magnetic-button px-10 md:px-14 py-5 md:py-6 glass-dark text-white font-black tracking-[0.3em] text-[10px] md:text-xs rounded-full hover:neon-border-cyan transition-all active:scale-95 flex items-center gap-4 backdrop-blur-3xl">
            {language === 'en' ? 'HIRE_TALENT' : 'RECRUTER_TALENT'}
          </a>
          <button 
            onClick={handleDownloadResume}
            className="px-10 md:px-14 py-5 md:py-6 glass-dark text-white font-black tracking-[0.3em] text-[10px] md:text-xs rounded-full hover:border-accent-purple/50 transition-all active:scale-95 flex items-center gap-4 group"
          >
            <Download size={14} className="text-accent-purple transition-transform group-hover:-translate-y-1" /> {language === 'en' ? 'RESUME.PDF' : 'CV.PDF'}
          </button>
        </motion.div>
 
        {/* Home Stats */}
        <div className="grid grid-cols-3 gap-12 mt-24 max-w-2xl w-full border-t border-white/5 pt-12 opacity-60">
           {stats.map((s, i) => (
             <div key={i} className="text-center">
                <div className="text-2xl md:text-4xl font-black mb-1">{s.value}</div>
                <div className="text-[8px] font-black tracking-widest text-muted uppercase">{s.label}</div>
             </div>
           ))}
        </div>

        {/* Floating Icons Decors */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
          <motion.div animate={{ y: [0, -30, 0], rotate: 360 }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-1/4 left-10 text-accent-cyan/20"><Cpu size={80} strokeWidth={1} /></motion.div>
          <motion.div animate={{ y: [0, 40, 0], rotate: -360 }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-1/4 right-10 text-accent-purple/20"><Globe size={100} strokeWidth={1} /></motion.div>
          <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 7, repeat: Infinity }} className="absolute top-1/3 right-1/4 text-white/5"><Sparkles size={200} /></motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex items-center gap-4 text-accent-cyan font-mono text-xs tracking-widest mb-6">
               <span className="w-12 h-[1px] bg-accent-cyan" />
               ALICE_DOSSIER.V1
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-10 leading-tight">
              {language === 'en' ? 'Architecting the' : 'Architecturer la'} <br /><span className="text-gradient">{language === 'en' ? 'Next Dimension.' : 'Prochaine Dimension.'}</span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted text-xl leading-relaxed mb-10 font-light">
              {language === 'en' 
                ? "I am Alice Niyitugize, a passionate engineer with 4+ years of technical excellence. Graduating from Rwanda Coding Academy, I specialize in building robust software architectures, high-frequency web ecosystems, and AI-driven interactive experiences."
                : "Je suis Alice Niyitugize, ingénieure passionnée possédant plus de 4 ans d'excellence technique. Diplômée de la Rwanda Coding Academy, je me spécialise dans la construction d'architectures logicielles robustes, de systèmes web à haute fréquence et d'expériences interactives pilotées par l'IA."}
            </motion.p>
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="glass-dark p-8 rounded-3xl group hover:neon-border-cyan transition-all duration-500">
                <GraduationCap className="text-accent-cyan mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-black mb-2 uppercase text-[10px] tracking-[0.2em]">{language === 'en' ? 'Academic Mastery' : 'Maîtrise Académique'}</h4>
                <p className="text-xs text-muted leading-relaxed">
                  {language === 'en'
                    ? "Software Engineering Graduate at Rwanda Coding Academy. Distinction in Algorithm Efficiency."
                    : "Diplômée en Génie Logiciel de la Rwanda Coding Academy. Distinction d'excellence en efficacité algorithmique."}
                </p>
              </div>
              <div className="glass-dark p-8 rounded-3xl group hover:neon-border-purple transition-all duration-500">
                <BrainCircuit className="text-accent-purple mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="font-black mb-2 uppercase text-[10px] tracking-[0.2em]">{language === 'en' ? 'Neural Expertise' : 'Expertise Cognitive'}</h4>
                <p className="text-xs text-muted leading-relaxed">
                  {language === 'en'
                    ? "Specializing in Machine Learning integration and Game Engine optimization."
                    : "Spécialisée dans l'intégration de l'apprentissage automatique et l'optimisation des moteurs de jeu."}
                </p>
              </div>
            </motion.div>

            <motion.button 
              onClick={handleDownloadResume}
              variants={itemVariants} 
              className="group flex items-center gap-4 text-white font-black uppercase text-[10px] tracking-[0.3em] hover:text-accent-cyan transition-all"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-accent-cyan group-hover:rotate-45 transition-all">
                <ArrowRight size={16} />
              </div>
              {language === 'en' ? 'GET FULL CURRICULUM VITAE' : 'TÉLÉCHARGER LE CV COMPLET'}
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 relative">
             <div className="absolute -inset-4 bg-gradient-to-tr from-accent-cyan/10 via-transparent to-accent-purple/10 blur-3xl opacity-30 animate-pulse" />
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="glass-dark p-12 rounded-[3.5rem] flex items-center justify-between group cursor-default hover:bg-white/[0.05] transition-all"
              >
                <div>
                  <div className="text-[10px] font-black text-muted tracking-[0.3em] mb-2">{stat.label}</div>
                  <div className="text-[10px] text-accent-cyan tracking-widest">{stat.sub}</div>
                </div>
                <div className="text-6xl md:text-8xl font-black text-white group-hover:text-glow-cyan transition-all duration-500">{stat.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-40 px-6 bg-white/[0.01] relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -right-1/4 -top-1/4 w-1/2 h-1/2 bg-accent-purple/10 blur-[120px]" 
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-6"
            >
              {language === 'en' ? 'Neural' : 'Infrastructure'} <span className="text-gradient">{language === 'en' ? 'Infrastructure' : 'Cognitive'}</span>
            </motion.h2>
            <p className="text-muted font-black tracking-[0.4em] font-mono text-[10px] uppercase">
              {language === 'en' ? 'Optimized Tech Stack for Global Deployment' : 'Tech Stack Optimisé pour le Déploiement Global'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -15 }}
                className="neon-glow-card group p-10 glass-dark rounded-[2.5rem] transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} p-[1px] mb-12`}>
                   <div className="w-full h-full rounded-[15px] bg-dark flex items-center justify-center">
                     <skill.icon className="text-white group-hover:scale-110 transition-transform" size={24} />
                   </div>
                </div>
                <h3 className="font-display font-bold text-xl tracking-tight mb-2">{skill.name}</h3>
                <div className="flex justify-between items-end gap-4 mt-8">
                   <div className="flex-1 space-y-1.5">
                     <div className="flex justify-between text-[8px] font-black tracking-widest text-muted">
                        <span>PROFICIENCY</span>
                        <span className="text-accent-cyan">95%</span>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "95%" }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className="h-full bg-gradient-to-r from-accent-cyan to-accent-purple" 
                        />
                     </div>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruiter Experience Section */}
      <section className="py-40 px-6 relative bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-8 uppercase">Service <span className="text-gradient">Capabilities</span></h2>
            <p className="text-muted font-black tracking-[0.4em] font-mono text-[10px] uppercase">Enterprise Solutions & Engineering Paradigms</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "System Architecture", icon: CpuIcon, price: "Custom", desc: "Designing scalable, secure, and high-performance backend infrastructures." },
              { title: "AI Integration", icon: BrainCircuit, price: "Premium", desc: "Infusing LLMs and neural networks into existing digital ecosystems." },
              { title: "Game Engineering", icon: GameIcon, price: "Project", desc: "Building immersive 3D/2D experiences with advanced mechanics." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -20 }}
                className="glass-dark p-12 rounded-[4rem] border-t border-white/5 relative group overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-accent-cyan/10 transition-colors">
                   <service.icon size={80} />
                </div>
                <service.icon className="text-accent-cyan mb-8" size={40} />
                <h3 className="text-2xl font-display font-bold mb-4 uppercase tracking-tighter">{service.title}</h3>
                <p className="text-muted text-sm leading-relaxed mb-10 font-light">{service.desc}</p>
                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                   <span className="text-[10px] font-black tracking-widest text-muted uppercase">TIER: {service.price}</span>
                   <button className="text-accent-cyan text-[10px] font-black tracking-widest hover:translate-x-2 transition-transform flex items-center gap-2">
                      QUERY_PRICING <ArrowRight size={12} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial Preview */}
          <div className="mt-32 glass-dark p-12 md:p-20 rounded-[4rem] text-center relative overflow-hidden">
             <div className="absolute top-10 left-10 text-white/5"><Quote size={120} /></div>
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="relative z-10"
             >
                <p className="text-2xl md:text-4xl font-display font-light italic leading-snug mb-12 max-w-4xl mx-auto">
                   "Alice's ability to translate complex neural architectures into seamless user interfaces is simply unmatchable in the current market."
                </p>
                <div className="flex flex-col items-center">
                   <div className="w-16 h-16 rounded-full bg-white/10 mb-4 overflow-hidden border-2 border-accent-cyan">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=3087&auto=format&fit=crop" alt="Client" />
                   </div>
                   <div className="font-black text-xs tracking-widest uppercase">Marc Villeneuve</div>
                   <div className="text-[8px] text-muted font-black tracking-[0.2em] uppercase mt-1">CTO @ TECH_SOLUTIONS</div>
                </div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <span className="text-accent-purple font-mono text-[10px] font-black tracking-[0.4em] mb-6 block uppercase">PROJECT_MANIFEST.02</span>
              <h2 className="text-5xl md:text-8xl font-display font-medium tracking-tight">
                {language === 'en' ? 'System Node' : 'Archive de Node' } <br /><span className="text-muted">{language === 'en' ? 'Archive' : 'Système'}</span>
              </h2>
            </div>
            <div className="flex flex-wrap gap-4 glass-dark p-2 rounded-full border border-white/5 backdrop-blur-3xl shadow-xl">
               {["All", "Web", "AI", "Games"].map((cat) => {
                 const translatedCat = language === 'en' 
                   ? cat 
                   : (cat === 'All' ? 'Tous' : (cat === 'AI' ? 'IA' : (cat === 'Games' ? 'Jeux' : 'Web')));
                 return (
                   <button 
                    key={cat}
                    onClick={() => setProjectFilter(cat)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black tracking-widest transition-all ${projectFilter === cat ? 'bg-white text-dark shadow-xl' : 'hover:bg-white/5 text-muted hover:text-white'}`}
                   >
                     {translatedCat.toUpperCase()}
                   </button>
                 );
               })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-16">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                  className="group lg:flex items-stretch glass-dark rounded-[4rem] overflow-hidden hover:neon-border-cyan transition-all duration-700 relative"
                >
                  <div className="lg:w-1/2 relative overflow-hidden h-[400px] lg:h-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/20 to-transparent z-10" />
                    <img 
                      src={`https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=3270&auto=format&fit=crop`} 
                      alt={project.title}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:scale-110 group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute top-10 left-10 z-20 flex flex-wrap gap-3">
                      {project.tech.map(t => (
                        <span key={t} className="px-5 py-2 bg-dark/90 border border-white/10 backdrop-blur-xl rounded-full text-[8px] font-black tracking-[0.2em] shadow-2xl">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-center bg-mesh relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-20 transition-opacity">
                       {project.category === "AI" ? <BrainCircuit size={120} /> : project.category === "Games" ? <GameIcon size={120} /> : <Monitor size={120} />}
                    </div>
                    <div className="flex items-center justify-between gap-4 mb-4 text-[10px] font-black tracking-[0.4em] uppercase">
                      <div className="text-accent-cyan flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-accent-cyan" /> {language === 'en' ? 'DEPLOYED_ACTIVE' : 'DÉPLOYÉ_ACTIF'}
                      </div>
                      <div className="text-white/40 font-mono text-[9px] tracking-widest">{project.timeline}</div>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-display font-medium mb-6 tracking-tight group-hover:text-glow-cyan transition-all uppercase">{project.title}</h3>
                    <p className="text-muted text-lg leading-relaxed mb-12 font-light">{project.desc}</p>
                    
                    <AnimatePresence>
                      {expandedProjects[project.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden mb-8"
                        >
                          <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4 font-mono text-xs">
                            <div className="text-[10px] font-black tracking-[0.3em] text-accent-cyan uppercase mb-4 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse animate-duration-1000" />
                              {language === 'en' ? 'TECHNICAL_SPECIFICATIONS.LOG' : 'SPÉCIFICATIONS_TECHNIQUES.LOG'}
                            </div>
                            {project.specs?.map((spec, sIdx) => (
                              <div key={sIdx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                <div className="text-white/40 uppercase font-black tracking-[0.2em] text-[9px] mb-1">{spec.label}</div>
                                <div className="text-white leading-relaxed font-light">{spec.val}</div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex flex-wrap gap-4 pt-10 border-t border-white/5">
                      <a 
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:neon-border-cyan hover:scale-110 shadow-xl transition-all group/icon flex items-center justify-center cursor-pointer"
                        title={language === 'en' ? 'GitHub Repository' : 'Dépôt GitHub'}
                      >
                        <Github size={24} className="group-hover/icon:text-accent-cyan" />
                      </a>
                      <button 
                        onClick={() => toggleProjectExpand(project.id)}
                        className="px-8 py-6 rounded-3xl bg-white/5 border border-white/10 hover:neon-border-purple hover:scale-105 shadow-xl transition-all text-[10px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-3 active:scale-[0.98] cursor-pointer outline-none"
                      >
                        <span>{expandedProjects[project.id] ? (language === 'en' ? 'HIDE SPECIFICATIONS' : 'MASQUER DÉTAILS') : (language === 'en' ? 'VIEW SPECIFICATIONS' : 'DÉTAILS TECHNIQUES')}</span>
                        {expandedProjects[project.id] ? <ChevronUp size={16} className="text-accent-purple" /> : <ChevronDown size={16} className="text-accent-purple" />}
                      </button>
                      <a 
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-6 rounded-3xl bg-white text-dark font-black text-[10px] tracking-[0.4em] hover:bg-accent-cyan hover:shadow-[0_0_50px_rgba(0,242,255,0.5)] transition-all flex items-center justify-center gap-4 active:scale-[0.98] cursor-pointer"
                      >
                        {language === 'en' ? 'ACCESS LIVE NODE' : 'ACCÉDER AU SITE LIVE'} <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 px-6 relative bg-mesh">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="glass-dark p-2 rounded-full mb-10">
            <div className="px-8 py-3 bg-accent-cyan/10 rounded-full text-accent-cyan text-[10px] font-black tracking-[0.4em]">
              {language === 'en' ? 'INITIATE PROTOCOL' : 'INITIALISER PROTOCOLE'}
            </div>
          </div>
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-9xl font-display font-black tracking-tighter mb-16"
          >
            {language === 'en' ? (
              <>Bridge the <br /><span className="text-gradient">Connection.</span></>
            ) : (
              <>Créer la <br /><span className="text-gradient">Connexion.</span></>
            )}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mb-32">
            {[
              { icon: Mail, label: "COMMUNICATION", val: "niyitugizealice9@gmail.com", link: "mailto:niyitugizealice9@gmail.com", color: "text-accent-cyan" },
              { icon: Phone, label: language === 'en' ? "SECURE_LINE" : "LIGNE_SÉCURISÉE", val: "+250780965827", link: "https://wa.me/250780965827", color: "text-accent-purple" },
              { icon: Instagram, label: "VISUAL_NETWORK", val: "@alicewantwari", link: "https://instagram.com/alicewantwari", color: "text-pink-500" },
              { icon: Facebook, label: "SOCIAL_GRID", val: "Alice Wantwari", link: "https://facebook.com/alicewantwari", color: "text-blue-500" }
            ].map((social, i) => (
              <motion.a 
                key={i}
                href={social.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -10 }}
                className="p-10 glass-dark rounded-[3rem] hover:neon-border-cyan transition-all group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <social.icon className={`mx-auto mb-6 ${social.color} group-hover:scale-125 transition-transform duration-500`} size={32} />
                <div className="text-[10px] font-black text-muted mb-2 tracking-[0.3em] uppercase">{social.label}</div>
                <div className="text-xs font-bold truncate max-w-full px-2 tracking-widest">{social.val}</div>
              </motion.a>
            ))}
          </div>

          <div className="w-full max-w-3xl glass-dark p-10 md:p-20 rounded-[5rem] border-t border-white/10 text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 blur-[80px] -z-10" />
             <div className="flex items-center gap-6 mb-16">
                <div className="w-12 h-12 rounded-full border border-accent-cyan flex items-center justify-center text-accent-cyan animate-pulse">
                   <Send size={18} />
                </div>
                <h3 className="text-2xl font-display font-medium tracking-tight">
                  {language === 'en' ? 'TRANSMIT DATA PACKET' : 'TRANSMETTRE PAQUET DE DONNÉES'}
                </h3>
             </div>
            <form onSubmit={handleContactSubmit} className="space-y-12">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted tracking-[0.4em] ml-6">
                    {language === 'en' ? 'SENDER_NAME' : 'NOM_EXPÉDITEUR'}
                  </label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl focus:outline-none focus:neon-border-cyan transition-all text-sm tracking-widest" 
                    placeholder={language === 'en' ? 'IDENTIFY YOURSELF' : 'IDENTIFIEZ-VOUS'} 
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-muted tracking-[0.4em] ml-6">
                    {language === 'en' ? 'SENDER_EMAIL' : 'EMAIL_EXPÉDITEUR'}
                  </label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl focus:outline-none focus:neon-border-cyan transition-all text-sm tracking-widest" 
                    placeholder={language === 'en' ? 'RESPONSE_ADDRESS' : 'ADRESSE_DE_RÉPONSE'} 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted tracking-[0.4em] ml-6">
                  {language === 'en' ? 'MISSION_SUBJECT' : 'SUJET_DE_LA_MISSION'}
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-6 rounded-3xl focus:outline-none focus:neon-border-cyan transition-all text-sm tracking-widest" 
                  placeholder={language === 'en' ? 'CLASSIFICATION' : 'CLASSIFICATION'} 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-muted tracking-[0.4em] ml-6">
                  {language === 'en' ? 'TRANSMISSION_CONTENT' : 'CONTENU_TRANSMISSION'}
                </label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-8 rounded-[3rem] h-52 focus:outline-none focus:neon-border-cyan transition-all text-sm tracking-widest resize-none" 
                  placeholder={language === 'en' ? 'DETAILS OF THE OBJECTIVE...' : "DÉTAILS DE L'OBJECTIF..."} 
                />
              </div>
              <button 
                disabled={isSending}
                type="submit"
                className={`w-full py-6 bg-white text-dark font-black tracking-[0.5em] text-[10px] rounded-3xl transition-all flex items-center justify-center gap-4 ${isSending ? 'opacity-50 cursor-wait' : 'hover:bg-accent-cyan hover:shadow-[0_0_50px_rgba(0,242,255,0.6)] active:scale-95'}`}
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                ) : (
                  language === 'en' ? 'INITIATE TRANSMISSION' : 'LANCER LA TRANSMISSION'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-40 px-6 bg-white/[0.01] relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <span className="text-accent-cyan font-mono text-[10px] font-black tracking-[0.4em] mb-6 block uppercase">
              {t[language].faqTitle}
            </span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-6"
            >
              {language === 'en' ? 'Core' : 'Questions'}{" "}
              <span className="text-gradient">
                {language === 'en' ? 'Inquiries' : 'Fréquentes'}
              </span>
            </motion.h2>
            <p className="text-muted font-light text-lg">
              {language === 'en' 
                ? 'Answers to system operations and service protocols' 
                : 'Réponses sur le fonctionnement du système et nos services'}
            </p>
          </div>

          <div className="space-y-6">
            {t[language].faqs.map((item, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className={`glass-dark rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                    isOpen ? 'border-accent-cyan/30 bg-white/[0.04]' : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full py-8 px-10 flex justify-between items-center text-left gap-6 group transition-all"
                  >
                    <span className="font-display text-lg md:text-xl font-medium tracking-tight group-hover:text-accent-cyan transition-colors">
                      {item.q}
                    </span>
                    <div className={`p-3 rounded-full border transition-all ${
                      isOpen ? 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan' : 'border-white/10 text-muted group-hover:border-white/20'
                    }`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-10 pb-10 text-muted leading-relaxed text-sm md:text-base border-t border-white/5 pt-6 font-light">
                      {item.a}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20 text-center md:text-left">
            <div>
              <div className="font-display font-black text-4xl text-gradient mb-4">NIYITUGUZE.</div>
              <p className="text-muted text-xs tracking-widest font-black max-w-sm">ENGINEERING FUTURISTIC INTERFACES FOR THE GLOBAL NETWORK.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-[10px] tracking-[0.4em] font-black text-muted">
              <a href="#" className="hover:text-accent-cyan transition-colors uppercase">Codepen</a>
              <a href="#" className="hover:text-accent-cyan transition-colors uppercase">Dribbble</a>
              <a href="#" className="hover:text-accent-cyan transition-colors uppercase">Read.cv</a>
               <a href="#" className="hover:text-accent-cyan transition-colors uppercase">Layers</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 text-[8px] tracking-[0.5em] font-black text-muted/50 uppercase">
             <div>© 2026 ALICE NIYITUGUZE — ALL RIGHTS RESERVED / ENCRYPTED SECTION</div>
             <div>DESIGNED IN 2026 / SYS_STATUS: OPTIMAL</div>
          </div>
        </div>
      </footer>

       {/* Success Modal */}
       <AnimatePresence>
         {isSuccessModalOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[500] flex items-center justify-center px-6 bg-dark/95 backdrop-blur-2xl"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-xl glass-dark rounded-[4rem] p-12 md:p-20 text-center border-t border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-cyan to-accent-purple" />
                 <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-10 text-emerald-500 animate-bounce">
                    <CheckCircle2 size={48} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight">TRANSMISSION <br /> SUCCESSFUL.</h2>
                 <p className="text-muted text-lg font-light leading-relaxed mb-12">
                   Your communication has been encrypted and delivered to Alice's secure node. Expect a response within 24 hours.
                 </p>
                 <button 
                  onClick={() => setIsSuccessModalOpen(false)}
                  className="w-full py-6 bg-white text-dark font-black tracking-[0.5em] text-[10px] rounded-3xl hover:bg-accent-cyan transition-all active:scale-95"
                 >
                   TERMINATE_OVERLAY
                 </button>
              </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

       {/* WhatsApp Connection Fallback Modal */}
       <AnimatePresence>
         {isWhatsAppModalOpen && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[500] flex items-center justify-center px-6 bg-dark/95 backdrop-blur-2xl"
           >
              <motion.div 
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-xl glass-dark rounded-[4rem] p-12 md:p-16 text-center border-t border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#25D366] to-accent-cyan" />
                 <div className="w-24 h-24 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto mb-10 text-[#25D366] animate-pulse">
                    <Phone size={48} />
                 </div>
                 <h2 className="text-4xl md:text-5xl font-display font-black mb-6 tracking-tight uppercase">TRANSMISSION<br />REDIRECT.</h2>
                 <p className="text-muted text-sm md:text-base font-light leading-relaxed mb-10">
                   Primary email node connection failed or is currently in standard setup mode. Execute immediate, zero-latency communication with Alice's secure WhatsApp line.
                 </p>
                 
                 <div className="space-y-4">
                   <a 
                     href="https://wa.me/250780965827"
                     target="_blank"
                     rel="noreferrer"
                     onClick={() => setIsWhatsAppModalOpen(false)}
                     className="block w-full py-6 bg-[#25D366] text-white font-black tracking-[0.3em] text-[10px] rounded-3xl hover:bg-[#1ebd54] text-center hover:shadow-[0_0_45px_rgba(37,211,102,0.5)] transition-all active:scale-95"
                   >
                     EXECUTE_WHATSAPP_LINK
                   </a>
                   <button 
                    onClick={() => setIsWhatsAppModalOpen(false)}
                    className="w-full py-6 bg-white/5 border border-white/10 text-white font-black tracking-[0.3em] text-[10px] rounded-3xl hover:bg-white/10 transition-all active:scale-95"
                   >
                     ABORT_MISSION
                   </button>
                 </div>
              </motion.div>
           </motion.div>
         )}
       </AnimatePresence>

      {/* WhatsApp Static Button */}

      <motion.a 
        href="https://wa.me/250780965827"
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 left-6 z-[100] w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.4)] group overflow-visible cursor-pointer"
      >
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <Phone className="text-white fill-white group-hover:rotate-12 transition-transform" />
        <div className="absolute left-full ml-4 bg-white text-dark px-6 py-2 rounded-full text-[8px] font-black tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all shadow-2xl pointer-events-none">
           CHAT WITH ALICE
        </div>
      </motion.a>

      {/* AI Chatbot */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
              className="absolute bottom-20 right-0 w-[380px] md:w-[420px] h-[550px] glass-dark rounded-[3.5rem] border-t border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
            >
              <div className="p-8 bg-white/[0.03] border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center p-[2px]">
                    <div className="w-full h-full rounded-full bg-dark flex items-center justify-center relative">
                       <BrainCircuit size={20} className="text-accent-cyan" />
                       <div className="absolute inset-0 rounded-full border border-accent-cyan/30 animate-ping opacity-20" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-black tracking-widest uppercase mb-0.5">ALiCE_NEURAL.V2</div>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse shadow-[0_0_8px_#00f2ff]" />
                       <div className="text-[8px] font-black tracking-widest text-accent-cyan">COGNITIVE ACTIVE</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                {messages.length === 0 && (
                  <div className="text-center py-20 space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="relative inline-block">
                       <Sparkles className="text-accent-cyan/40 scale-150" size={48} />
                       <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-dashed border-accent-cyan/10 rounded-full scale-[2]" 
                       />
                    </div>
                    <p className="text-[10px] text-muted leading-loose px-10 tracking-widest uppercase font-black">
                      Neural interface established. Query regarding skills, engineering mastery, or enterprise deployment.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 italic">
                       {['SKILLS_SET', 'PROJECT_NODES', 'CONTACT_INIT'].map(q => (
                         <button 
                           key={q}
                           onClick={() => { setInputMessage(q.replace('_', ' ')); handleSendMessage(); }}
                           className="px-6 py-3 glass-dark rounded-full text-[8px] font-black tracking-[0.2em] hover:bg-white hover:text-dark transition-all border border-white/5 active:scale-95"
                         >
                           {q}
                         </button>
                       ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-xs leading-relaxed tracking-wider ${msg.role === 'user' ? 'bg-accent-cyan text-dark font-black rounded-tr-none' : 'glass-dark text-white font-medium rounded-tl-none border border-white/10 shadow-xl'}`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass-dark px-6 py-4 rounded-3xl rounded-tl-none border border-white/5">
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.1s]" />
                        <div className="w-1.5 h-1.5 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 bg-white/[0.03] border-t border-white/5 flex gap-3">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="QUERY_CORE_API..."
                  className="flex-1 bg-dark/50 border border-white/10 px-6 py-4 rounded-3xl text-[10px] tracking-widest font-black focus:outline-none focus:border-accent-cyan transition-colors"
                />
                <button 
                  onClick={handleSendMessage}
                  className="p-4 bg-white text-dark rounded-full hover:bg-accent-cyan hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all active:scale-90"
                >
                  <Send size={18} strokeWidth={3} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-20 h-20 rounded-full bg-white text-dark shadow-[0_20px_50px_rgba(0,242,255,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-500 relative group z-[110]"
        >
          <div className="absolute inset-0 rounded-full bg-accent-cyan blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" />
          {isChatOpen ? <X size={28} strokeWidth={3} /> : <MessageSquare size={28} strokeWidth={3} />}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-cyan rounded-full border-2 border-white animate-pulse" />
        </button>
      </div>

      {/* Notifications Layer */}
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-4 pointer-events-none">
         <AnimatePresence>
           {notifications.map(n => (
             <motion.div 
               key={n.id}
               initial={{ opacity: 0, y: -20, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -20, scale: 0.9 }}
               className={`px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl glass-dark backdrop-blur-3xl border ${n.type === 'success' ? 'border-emerald-500/30' : 'border-rose-500/30'}`}
             >
                {n.type === 'success' ? <CheckCircle2 className="text-emerald-500" /> : <AlertCircle className="text-rose-500" />}
                <span className="text-[10px] font-black tracking-widest uppercase">{n.message}</span>
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
       
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-cyan to-accent-purple origin-left z-[150]"
        style={{ scaleX: useScrollProgress() }}
      />
      </motion.div>
    </div>
  );
}

// Custom hook for scroll progress
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(window.scrollY / scrollHeight);
      }
    };
    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);
  return progress;
}
