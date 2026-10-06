"use client";

import { useState, useEffect } from "react";
import SakuraFalling from "@/components/SakuraFalling"; 
import { checkAdmin, createPost, deletePost, getAllPosts, updatePost, getSectionContent, saveSectionContent, getAnalyticsData } from "@/lib/actions";
import dynamic from 'next/dynamic';
import { useSession, signIn, signOut } from "next-auth/react";
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// --- TYPES ---
interface Post { id: string; titleVi: string; titleEn: string; titleJp: string; tag: string; contentVi: string; contentEn: string; contentJp: string; images: string; createdAt: Date; }
interface SectionBox { id: string; title: string; items: { label: string; value: string }[]; }
interface SectionData { contentEn: string; contentVi: string; contentJp: string; }
interface HeroData { fullName: string; nickName1: string; nickName2: string; avatarUrl: string; greeting: string; description: string; typewriter: string; }
interface ConfigData { resumeUrl: string; isOpenForWork: boolean; }
interface ExpItem { id: string; time: string; role: string; details: string[]; }
interface ExpGroup { id: string; title: string; items: ExpItem[]; }
interface FaqItem { q: string; a: string; }
interface AiProfile { roleName: string; tone: string; customStory: string; systemPromptOverride: string; }
interface AiConfigData { hacker: AiProfile; sakura: AiProfile; }
interface Visit { id: string; lang: string; userAgent: string; createdAt: Date; }
interface ChatLog { id: string; mode: string; message: string; response: string; createdAt: Date; }

const DEFAULT_HERO: HeroData = { fullName: "Vũ Trí Dũng", nickName1: "David Miller", nickName2: "Akina Aoi", avatarUrl: "", greeting: "Hi, I am", description: "", typewriter: '["Developer", "Student"]' };
const DEFAULT_AI_CONFIG: AiConfigData = { 
    hacker: { roleName: "System Administrator", tone: "Logical, Cool, Concise", customStory: "", systemPromptOverride: "" },
    sakura: { roleName: "Sakura Assistant", tone: "Friendly, Cute, Helpful", customStory: "", systemPromptOverride: "" }
};

// --- STYLES ---
const s = {
    layout: { display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: '"Nunito", sans-serif', background: '#fff9fb' },
    sidebar: { width: '260px', background: 'linear-gradient(180deg, #ff69b4 0%, #ff8da1 100%)', color: 'white', display: 'flex', flexDirection: 'column' as const, padding: '30px 20px', boxShadow: '4px 0 20px rgba(255,105,180,0.2)', zIndex: 10 },
    mainContent: { flex: 1, overflowY: 'auto' as const, padding: '40px 50px' },
    card: { background: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(255,105,180,0.08)', marginBottom: '30px', border: '1px solid #ffe4e1' },
    title: { fontSize: '1.8rem', color: '#d81b60', fontWeight: '900', margin: 0 },
    subTitle: { fontSize: '1.2rem', color: '#5d4037', fontWeight: 'bold', marginBottom: '20px', borderLeft: '5px solid #ff69b4', paddingLeft: '12px' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '12px', border: '2px solid #ffc1e3', outline: 'none', marginBottom: '15px', fontSize: '0.95rem', color: '#5d4037', transition: '0.3s' },
    label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#8d6e63', fontSize: '0.85rem', textTransform: 'uppercase' as const, letterSpacing: '1px' },
    btnPrimary: { background: 'linear-gradient(135deg, #ff69b4, #d81b60)', color: 'white', padding: '12px 25px', borderRadius: '30px', border: 'none', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(255,105,180,0.4)', transition: 'all 0.3s' },
    btnSecondary: { background: 'white', color: '#d81b60', border: '2px solid #ff69b4', padding: '10px 20px', borderRadius: '30px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' },
    btnDelete: { background: '#fff0f5', color: '#d81b60', border: '1px solid #ffc1e3', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', transition: '0.2s' },
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '25px' },
    itemBox: { background: '#fffafc', padding: '20px', borderRadius: '15px', marginBottom: '15px', border: '1px dashed #ffc1e3' },
    navBtn: { width: '100%', padding: '12px 15px', marginBottom: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', textAlign: 'left' as const, transition: '0.3s' }
};

// --- SUB-COMPONENTS ---
const BoxEditor = ({ lang, data, onUpdate, titleLabel }: { lang: string, data: SectionBox[], onUpdate: (d: SectionBox[]) => void, titleLabel: string }) => (
    <div style={s.card}>
        <h3 style={s.subTitle}>{titleLabel} ({lang})</h3>
        {data.map((box, bIdx) => (
            <div key={box.id} style={s.itemBox}>
                <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input value={box.title} onChange={(e) => {const n=[...data];n[bIdx].title=e.target.value;onUpdate(n)}} style={{...s.input, fontWeight:'bold', color:'#ff69b4', marginBottom:0}} placeholder="Group Title" />
                    <button type="button" onClick={() => {const n=[...data];n.splice(bIdx,1);onUpdate(n)}} style={s.btnDelete}>X</button>
                </div>
                {box.items.map((it, iIdx) => (
                    <div key={iIdx} style={{display:'flex', gap:'10px', marginBottom: '10px'}}>
                        <input value={it.label} onChange={(e) => {const n=[...data];n[bIdx].items[iIdx].label=e.target.value;onUpdate(n)}} style={{...s.input, flex:1, marginBottom:0}} placeholder="Label" />
                        <input value={it.value} onChange={(e) => {const n=[...data];n[bIdx].items[iIdx].value=e.target.value;onUpdate(n)}} style={{...s.input, flex:2, marginBottom:0}} placeholder="Value" />
                        <button type="button" onClick={() => {const n=[...data];n[bIdx].items.splice(iIdx,1);onUpdate(n)}} style={{...s.btnDelete}}>×</button>
                    </div>
                ))}
                <button type="button" onClick={() => {const n=[...data];n[bIdx].items.push({label:"",value:""});onUpdate(n)}} style={{fontSize:'0.85rem', color:'#ff69b4', background:'none', border:'none', cursor:'pointer', fontWeight:'bold', padding: '5px'}}>+ Add Item</button>
            </div>
        ))}
        <button type="button" onClick={() => onUpdate([...data, {id:Date.now().toString(), title:"New Group", items:[]}])} style={{width:'100%', padding:'12px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'12px', cursor:'pointer', fontWeight:'bold'}}>+ ADD GROUP</button>
    </div> 
);

const ExpEditor = ({ lang, data, onUpdate }: { lang: string, data: ExpGroup[], onUpdate: (d: ExpGroup[]) => void }) => (
    <div style={s.card}>
        <h3 style={s.subTitle}>EXPERIENCE ({lang})</h3>
        {data.map((g, gIdx) => (
            <div key={g.id} style={{marginBottom:'25px', borderLeft:'4px solid #ff69b4', paddingLeft:'20px'}}>
                <div style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                    <input value={g.title} onChange={(e)=>{const n=[...data];n[gIdx].title=e.target.value;onUpdate(n)}} style={{...s.input, fontSize:'1.1rem', fontWeight:'bold', marginBottom:0}} placeholder="Category"/>
                    <button type="button" onClick={()=>{const n=[...data];n.splice(gIdx,1);onUpdate(n)}} style={s.btnDelete}>DEL</button>
                </div>
                {g.items.map((it, iIdx)=>(
                    <div key={it.id} style={{background:'white', padding:'20px', borderRadius:'12px', marginBottom:'15px', boxShadow:'0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #ffe4e1'}}>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:'15px'}}>
                            <input value={it.time} onChange={(e)=>{const n=[...data];n[gIdx].items[iIdx].time=e.target.value;onUpdate(n)}} style={s.input} placeholder="Time"/>
                            <div style={{display:'flex', gap:'10px'}}>
                                <input value={it.role} onChange={(e)=>{const n=[...data];n[gIdx].items[iIdx].role=e.target.value;onUpdate(n)}} style={{...s.input, fontWeight:'bold'}} placeholder="Role"/>
                                <button type="button" onClick={()=>{const n=[...data];n[gIdx].items.splice(iIdx,1);onUpdate(n)}} style={{...s.btnDelete, height: '46px'}}>×</button>
                            </div>
                        </div>
                        <textarea value={it.details.join('\n')} onChange={(e)=>{const n=[...data];n[gIdx].items[iIdx].details=e.target.value.split('\n');onUpdate(n)}} style={{...s.input, height:'100px', fontFamily:'monospace', fontSize:'0.85rem'}} placeholder="- Detail"/>
                    </div>
                ))}
                <button type="button" onClick={()=>{const n=[...data];n[gIdx].items.push({id:Date.now().toString(),time:"",role:"",details:[]});onUpdate(n)}} style={{fontSize:'0.85rem', color:'#ff69b4', background:'none', border:'none', cursor:'pointer', fontWeight:'bold'}}>+ Add Job</button>
            </div>
        ))}
        <button type="button" onClick={()=>onUpdate([...data,{id:Date.now().toString(),title:"New",items:[]}])} style={{width:'100%', padding:'12px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'12px', cursor:'pointer', fontWeight:'bold'}}>+ ADD CATEGORY</button>
    </div> 
);

const FaqEditor = ({ lang, data, onUpdate }: { lang: string, data: FaqItem[], onUpdate: (d: FaqItem[]) => void }) => (
    <div style={s.card}>
        <h3 style={s.subTitle}>FAQ ({lang})</h3>
        {data.map((it, idx)=>(
            <div key={idx} style={s.itemBox}>
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                    <label style={s.label}>Q</label>
                    <button type="button" onClick={()=>{const n=[...data];n.splice(idx,1);onUpdate(n)}} style={s.btnDelete}>×</button>
                </div>
                <input value={it.q} onChange={(e)=>{const n=[...data];n[idx].q=e.target.value;onUpdate(n)}} style={{...s.input, fontWeight:'bold', color:'#ff69b4'}} />
                <label style={s.label}>A</label>
                <textarea value={it.a} onChange={(e)=>{const n=[...data];n[idx].a=e.target.value;onUpdate(n)}} style={{...s.input, height:'80px'}} />
            </div>
        ))}
        <button type="button" onClick={()=>onUpdate([...data,{q:"",a:""}])} style={{width:'100%', padding:'12px', border:'2px dashed #ffc1e3', background:'none', color:'#ff69b4', borderRadius:'12px', cursor:'pointer', fontWeight:'bold'}}>+ ADD QUESTION</button>
    </div> 
);

const HeroEditor = ({ lang, data, onUpdate }: { lang: string; data: HeroData; onUpdate: (field: keyof HeroData, val: string) => void }) => ( 
    <div style={s.card}>
        <h3 style={s.subTitle}>HERO ({lang})</h3>
        <div><label style={s.label}>Greeting</label><input value={data.greeting} onChange={(e)=>onUpdate('greeting',e.target.value)} style={s.input} /></div>
        <div><label style={s.label}>Full Name</label><input value={data.fullName} onChange={(e)=>onUpdate('fullName',e.target.value)} style={s.input} /></div>
        <div style={{display:'flex', gap:'15px'}}>
            <div style={{flex:1}}><label style={s.label}>Nick 1</label><input value={data.nickName1} onChange={(e)=>onUpdate('nickName1', e.target.value)} style={s.input} /></div>
            <div style={{flex:1}}><label style={s.label}>Nick 2</label><input value={data.nickName2} onChange={(e)=>onUpdate('nickName2', e.target.value)} style={s.input} /></div>
        </div>
        <div><label style={s.label}>Typewriter (JSON Array)</label><input value={data.typewriter} onChange={(e)=>onUpdate('typewriter', e.target.value)} style={s.input} placeholder='["Dev", "Student"]' /></div>
        <div><label style={s.label}>Description</label><textarea value={data.description} onChange={(e)=>onUpdate('description', e.target.value)} style={{...s.input, height:'100px'}} /></div>
        <div><label style={s.label}>Avatar URL</label><input value={data.avatarUrl} onChange={(e)=>onUpdate('avatarUrl', e.target.value)} style={s.input} /></div>
    </div> 
);

const AiConfigEditor = ({ data, onUpdate }: { data: AiConfigData, onUpdate: (theme: 'hacker'|'sakura', f: keyof AiProfile, v: string) => void }) => (
    <div style={s.card}>
        <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'25px', borderBottom: '2px solid #ffe4e1', paddingBottom: '15px'}}>
            <span style={{fontSize:'2.5rem'}}>🧠</span>
            <h3 style={s.title}>DUAL CORE AI CONFIG</h3>
        </div>
        <div style={s.grid2}>
            <div style={{borderRight: '1px dashed #ffc1e3', paddingRight: '25px'}}>
                <h4 style={{...s.subTitle, color: '#333', borderLeft: '5px solid #333'}}>[ HACKER_MODE ]</h4>
                <div style={{marginBottom: '15px'}}><label style={s.label}>ROLE NAME</label><input value={data?.hacker?.roleName || ''} onChange={e => onUpdate('hacker', 'roleName', e.target.value)} style={s.input} placeholder="e.g. Cyber Security AI" /></div>
                <div style={{marginBottom: '15px'}}><label style={s.label}>TONE</label><input value={data?.hacker?.tone || ''} onChange={e => onUpdate('hacker', 'tone', e.target.value)} style={s.input} placeholder="e.g. Cold, Logical" /></div>
                <div style={{marginBottom: '15px'}}><label style={s.label}>SECRET / SYSTEM PROMPT</label><textarea value={data?.hacker?.customStory || ''} onChange={e => onUpdate('hacker', 'customStory', e.target.value)} style={{...s.input, height:'120px'}} placeholder="Hacker instructions..." /></div>
            </div>
            <div style={{paddingLeft: '15px'}}>
                <h4 style={s.subTitle}>✿ SAKURA_MODE ✿</h4>
                <div style={{marginBottom: '15px'}}><label style={s.label}>ROLE NAME</label><input value={data?.sakura?.roleName || ''} onChange={e => onUpdate('sakura', 'roleName', e.target.value)} style={s.input} placeholder="e.g. Sakura Assistant" /></div>
                <div style={{marginBottom: '15px'}}><label style={s.label}>TONE</label><input value={data?.sakura?.tone || ''} onChange={e => onUpdate('sakura', 'tone', e.target.value)} style={s.input} placeholder="e.g. Cute, Friendly" /></div>
                <div style={{marginBottom: '15px'}}><label style={s.label}>SECRET / SYSTEM PROMPT</label><textarea value={data?.sakura?.customStory || ''} onChange={e => onUpdate('sakura', 'customStory', e.target.value)} style={{...s.input, height:'120px'}} placeholder="Sakura instructions..." /></div>
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---
export default function AdminPage() {
  const { data: session, status } = useSession();
  const isAuth = status === "authenticated";
  const [activeTab, setActiveTab] = useState<'blog' | 'content' | 'analytics'>('blog');

  // BLOG STATES
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [tag, setTag] = useState("my_confessions");
  const [images, setImages] = useState<string[]>([]);
  
  // MD Editor States cho Blog
  const [blogContentVi, setBlogContentVi] = useState("");
  const [blogContentEn, setBlogContentEn] = useState("");
  const [blogContentJp, setBlogContentJp] = useState("");

  // SECTION STATES
  const [sectionKey, setSectionKey] = useState("about");
  const [msg, setMsg] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  const [secEn, setSecEn] = useState(""); const [secVi, setSecVi] = useState(""); const [secJp, setSecJp] = useState("");
  
  const [boxesEn, setBoxesEn] = useState<SectionBox[]>([]); const [boxesVi, setBoxesVi] = useState<SectionBox[]>([]); const [boxesJp, setBoxesJp] = useState<SectionBox[]>([]);
  
  const [heroEn, setHeroEn] = useState<HeroData>(DEFAULT_HERO); const [heroVi, setHeroVi] = useState<HeroData>(DEFAULT_HERO); const [heroJp, setHeroJp] = useState<HeroData>(DEFAULT_HERO);
  const [config, setConfig] = useState<ConfigData>({ resumeUrl: "", isOpenForWork: true });
  const [expEn, setExpEn] = useState<ExpGroup[]>([]); const [expVi, setExpVi] = useState<ExpGroup[]>([]); const [expJp, setExpJp] = useState<ExpGroup[]>([]);
  const [faqEn, setFaqEn] = useState<FaqItem[]>([]); const [faqVi, setFaqVi] = useState<FaqItem[]>([]); const [faqJp, setFaqJp] = useState<FaqItem[]>([]);
  const [aiConfig, setAiConfig] = useState<AiConfigData>(DEFAULT_AI_CONFIG);

  // ANALYTICS STATES
  const [visits, setVisits] = useState<Visit[]>([]);
  const [chatLogs, setChatLogs] = useState<ChatLog[]>([]);

  const isBoxSection = ['profile', 'contact', 'skills'].includes(sectionKey);
  const isExpSection = sectionKey === 'experience'; 
  const isHeroSection = sectionKey === 'hero';
  const isConfigSection = sectionKey === 'global_config';
  const isFaqSection = sectionKey === 'faq_data';
  const isAiConfigSection = sectionKey === 'ai_config';

  useEffect(() => { 
    getAllPosts().then((data) => setPosts(data as unknown as Post[])); 
  }, []);

  // LOAD ANALYTICS
  useEffect(() => {
    if (activeTab === 'analytics') {
      getAnalyticsData().then(data => {
        setVisits(data.visits as unknown as Visit[]);
        setChatLogs(data.chatLogs as unknown as ChatLog[]);
      });
    }
  }, [activeTab]);

  // LOAD SECTIONS
  useEffect(() => {
    if (activeTab === 'content') {
        const fetchSection = async () => {
            setMsg("🌸 Loading data...");
            try {
                const data = await getSectionContent(sectionKey);
                if (data) {
                    const typedData = data as unknown as SectionData;
                    if (isExpSection) { 
                        try { setExpEn(JSON.parse(typedData.contentEn)); } catch { setExpEn([]); } 
                        try { setExpVi(JSON.parse(typedData.contentVi)); } catch { setExpVi([]); } 
                        try { setExpJp(JSON.parse(typedData.contentJp)); } catch { setExpJp([]); } 
                    }
                    else if (isBoxSection) { 
                        try { setBoxesEn(JSON.parse(typedData.contentEn)); } catch { setBoxesEn([]); } 
                        try { setBoxesVi(JSON.parse(typedData.contentVi)); } catch { setBoxesVi([]); } 
                        try { setBoxesJp(JSON.parse(typedData.contentJp)); } catch { setBoxesJp([]); } 
                    } 
                    else if (isHeroSection) { 
                        try { setHeroEn({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentEn) }); } catch { setHeroEn(DEFAULT_HERO); } 
                        try { setHeroVi({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentVi) }); } catch { setHeroVi(DEFAULT_HERO); } 
                        try { setHeroJp({ ...DEFAULT_HERO, ...JSON.parse(typedData.contentJp) }); } catch { setHeroJp(DEFAULT_HERO); } 
                    }
                    else if (isConfigSection) { 
                        try { const p = JSON.parse(typedData.contentEn); setConfig({ resumeUrl: p.resumeUrl || "", isOpenForWork: p.isOpenForWork ?? true }); } catch { setConfig({ resumeUrl: "", isOpenForWork: true }); } 
                    }
                    else if (isFaqSection) { 
                        try { setFaqEn(JSON.parse(typedData.contentEn)); } catch { setFaqEn([]); } 
                        try { setFaqVi(JSON.parse(typedData.contentVi)); } catch { setFaqVi([]); } 
                        try { setFaqJp(JSON.parse(typedData.contentJp)); } catch { setFaqJp([]); } 
                    }
                    else if (isAiConfigSection) { 
                        try { 
                            const parsed = JSON.parse(typedData.contentEn);
                            setAiConfig({ hacker: parsed.hacker || DEFAULT_AI_CONFIG.hacker, sakura: parsed.sakura || DEFAULT_AI_CONFIG.sakura });
                        } catch { setAiConfig(DEFAULT_AI_CONFIG); } 
                    }
                    else { 
                        setSecEn(typedData.contentEn || ""); setSecVi(typedData.contentVi || ""); setSecJp(typedData.contentJp || ""); 
                    }
                } else {
                    setSecEn(""); setSecVi(""); setSecJp(""); 
                    setBoxesEn([]); setBoxesVi([]); setBoxesJp([]); 
                    setExpEn([]); setExpVi([]); setExpJp([]); 
                    setFaqEn([]); setFaqVi([]); setFaqJp([]); 
                    setHeroEn(DEFAULT_HERO); setHeroVi(DEFAULT_HERO); setHeroJp(DEFAULT_HERO); 
                    setConfig({ resumeUrl: "", isOpenForWork: true }); 
                    setAiConfig(DEFAULT_AI_CONFIG);
                }
                setMsg("");
            } catch (error) { console.error(error); setMsg("Error loading!"); }
        };
        fetchSection();
    }
  }, [sectionKey, activeTab, isBoxSection, isHeroSection, isConfigSection, isExpSection, isFaqSection, isAiConfigSection]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    
    if (res?.error) {
      alert("Wrong Password! 🌸");
    }
  }
  
  const addLinkField = () => setImages([...images, ""]);
  const removeLinkField = (index: number) => { const newImg = [...images]; newImg.splice(index, 1); setImages(newImg); };
  const updateLinkField = (index: number, val: string) => { const newImg = [...images]; newImg[index] = val; setImages(newImg); };
  
  async function handleBlogSubmit(formData: FormData) { 
      const jsonImages = JSON.stringify(images.filter(img => img.trim() !== "")); formData.set("images", jsonImages);
      // Ghi đè content từ MDEditor state vào FormData (vì component MDEditor không tự bind vào FormData được tốt trong Nextjs actions)
      formData.set("contentVi", blogContentVi);
      formData.set("contentEn", blogContentEn);
      formData.set("contentJp", blogContentJp);

      if (editingPost) await updatePost(formData); else await createPost(formData);
      
      setEditingPost(null); 
      setImages([]); 
      setBlogContentVi(""); setBlogContentEn(""); setBlogContentJp("");
      
      setPosts(await getAllPosts() as unknown as Post[]); 
      alert("Saved! 🌸");
  }
  
  function startEdit(post: Post) { 
      setEditingPost(post); 
      setTag(post.tag); 
      setBlogContentVi(post.contentVi);
      setBlogContentEn(post.contentEn);
      setBlogContentJp(post.contentJp);
      try { setImages(JSON.parse(post.images)); } catch { setImages([]); } 
      document.querySelector('.main-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' }); 
  }
  
  async function handleDelete(id: string) { if(!confirm("Delete this?")) return; await deletePost(id); setPosts(await getAllPosts() as unknown as Post[]); }

  const updateHero = (lang: 'en'|'vi'|'jp', field: keyof HeroData, val: string) => { 
      const setter = lang === 'en' ? setHeroEn : (lang === 'vi' ? setHeroVi : setHeroJp);
      setter(prev => ({ ...prev, [field]: val }));
  };
  
  const updateAiConfig = (theme: 'hacker'|'sakura', field: keyof AiProfile, val: string) => { 
      setAiConfig(prev => ({ ...prev, [theme]: { ...prev[theme], [field]: val } })); 
  };

  async function handleSectionSubmit(formData: FormData) {
    if (isSaving) return; setIsSaving(true); setMsg("Saving...");
    
    if (isExpSection) { formData.set("contentEn", JSON.stringify(expEn)); formData.set("contentVi", JSON.stringify(expVi)); formData.set("contentJp", JSON.stringify(expJp)); } 
    else if (isBoxSection) { formData.set("contentEn", JSON.stringify(boxesEn)); formData.set("contentVi", JSON.stringify(boxesVi)); formData.set("contentJp", JSON.stringify(boxesJp)); } 
    else if (isHeroSection) { formData.set("contentEn", JSON.stringify(heroEn)); formData.set("contentVi", JSON.stringify(heroVi)); formData.set("contentJp", JSON.stringify(heroJp)); } 
    else if (isConfigSection) { formData.set("contentEn", JSON.stringify(config)); formData.set("contentVi", ""); formData.set("contentJp", ""); } 
    else if (isFaqSection) { formData.set("contentEn", JSON.stringify(faqEn)); formData.set("contentVi", JSON.stringify(faqVi)); formData.set("contentJp", JSON.stringify(faqJp)); } 
    else if (isAiConfigSection) { formData.set("contentEn", JSON.stringify(aiConfig)); formData.set("contentVi", ""); formData.set("contentJp", ""); }
    else { formData.set("contentEn", secEn); formData.set("contentVi", secVi); formData.set("contentJp", secJp); }
    
    const res = await saveSectionContent(formData); 
    setIsSaving(false); 
    if (res.success) { setMsg("Saved! 🌸"); setTimeout(() => setMsg(""), 3000); } else setMsg("Failed!");
  }

  // --- COMPUTE ANALYTICS STATS ---
  const totalVisits = visits.length;
  const langCount = visits.reduce((acc, v) => {
      acc[v.lang] = (acc[v.lang] || 0) + 1;
      return acc;
  }, {} as Record<string, number>);

  if (status === "loading") return <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', background:'#fff9fb'}}><h2 style={{color: '#ff69b4'}}>Checking credentials... 🌸</h2></div>;

  if (!isAuth) return ( <div style={{display:'flex', height:'100vh', justifyContent:'center', alignItems:'center', background:'#fff9fb'}}><form onSubmit={handleLogin} style={{...s.card, width:'400px', textAlign:'center'}}><h1 style={{...s.title, marginBottom:'20px'}}>🌸 ADMIN LOGIN</h1><input name="username" placeholder="Username" style={s.input} /><input name="password" type="password" placeholder="Password" style={s.input} /><button style={{...s.btnPrimary, width:'100%', marginTop:'15px'}}>LOGIN TO DASHBOARD</button></form></div> );

  return (
    <div style={s.layout}>
      <SakuraFalling />
      
      {/* --- SIDEBAR --- */}
      <div style={s.sidebar}>
          <div style={{textAlign: 'center', marginBottom: '40px'}}>
              <div style={{fontSize: '4rem', marginBottom: '10px', textShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>🌸</div>
              <h2 style={{margin: 0, fontSize: '1.2rem', letterSpacing: '2px', fontWeight: 900}}>SAKURA DASH</h2>
          </div>
          
          <div style={{flex: 1}}>
              <button onClick={() => setActiveTab('blog')} style={{...s.navBtn, background: activeTab === 'blog' ? 'white' : 'transparent', color: activeTab === 'blog' ? '#ff69b4' : 'white'}}>📝 Blog & Projects</button>
              <button onClick={() => setActiveTab('content')} style={{...s.navBtn, background: activeTab === 'content' ? 'white' : 'transparent', color: activeTab === 'content' ? '#ff69b4' : 'white'}}>🎨 Web Sections</button>
              <button onClick={() => setActiveTab('analytics')} style={{...s.navBtn, background: activeTab === 'analytics' ? 'white' : 'transparent', color: activeTab === 'analytics' ? '#ff69b4' : 'white'}}>📊 Analytics</button>
          </div>
          
          <button onClick={() => signOut()} style={{...s.navBtn, background: 'rgba(255,255,255,0.2)', color: 'white', textAlign: 'center'}}>LOGOUT</button>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="main-scroll-area" style={s.mainContent}>
          
          {/* --- BLOG TAB --- */}
          {activeTab === 'blog' && (
            <div>
                 <div style={{...s.card, borderTop: '4px solid #ff69b4'}}>
                    <h2 style={s.title}>{editingPost ? "✎ EDIT POST" : "✨ NEW POST"}</h2>
                    <p style={{color: '#8d6e63', marginBottom: '30px'}}>Manage your portfolio projects and blog posts using Markdown.</p>
                    
                    <form action={handleBlogSubmit}>
                        {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                        
                        <div style={s.grid3}>
                            <div><label style={s.label}>TITLE (VI)</label><input name="titleVi" defaultValue={editingPost?.titleVi} required style={s.input} /></div>
                            <div><label style={s.label}>TITLE (EN)</label><input name="titleEn" defaultValue={editingPost?.titleEn} required style={s.input} /></div>
                            <div><label style={s.label}>TITLE (JP)</label><input name="titleJp" defaultValue={editingPost?.titleJp} required style={s.input} /></div>
                        </div>

                        <label style={s.label}>TAG</label>
                        <select name="tag" value={tag} onChange={e=>setTag(e.target.value)} style={{...s.input, marginBottom: '25px', padding: '15px'}}>
                            <option value="my_confessions">My Confessions</option>
                            <option value="uni_projects">University Projects</option>
                            <option value="personal_projects">Personal Projects</option>
                            <option value="achievements">Achievements</option>
                            <option value="it_events">IT Events</option>
                            <option value="other_events">Other Events</option>
                            <option value="lang_certs">Language Certs</option>
                            <option value="tech_certs">Tech Certs</option>
                            <option value="other_certs">Other Certs</option>
                        </select>

                        <div style={{marginBottom: '25px'}} data-color-mode="light">
                            <label style={s.label}>CONTENT (VI) - Markdown</label>
                            <MDEditor value={blogContentVi} onChange={(val) => setBlogContentVi(val || "")} height={300} />
                        </div>
                        <div style={{marginBottom: '25px'}} data-color-mode="light">
                            <label style={s.label}>CONTENT (EN) - Markdown</label>
                            <MDEditor value={blogContentEn} onChange={(val) => setBlogContentEn(val || "")} height={300} />
                        </div>
                        <div style={{marginBottom: '25px'}} data-color-mode="light">
                            <label style={s.label}>CONTENT (JP) - Markdown</label>
                            <MDEditor value={blogContentJp} onChange={(val) => setBlogContentJp(val || "")} height={300} />
                        </div>

                        <div style={s.itemBox}>
                            <label style={s.label}>IMAGES (Ext. URLs)</label>
                            {images.map((l,i)=>(
                                <div key={i} style={{display:'flex', gap:'10px', marginBottom:'10px'}}>
                                    <input value={l} onChange={e=>updateLinkField(i,e.target.value)} style={{...s.input, marginBottom:0}} placeholder="https://i.imgur.com/..." />
                                    <button type="button" onClick={()=>removeLinkField(i)} style={s.btnDelete}>X</button>
                                </div>
                            ))}
                            <button type="button" onClick={addLinkField} style={{fontSize:'0.9rem', color:'#d81b60', border:'none', background:'none', cursor:'pointer', fontWeight: 'bold'}}>+ Add Image Link</button>
                        </div>

                        <div style={{display:'flex', gap:'15px', marginTop:'20px'}}>
                            <button style={{...s.btnPrimary, flex:1, fontSize: '1.1rem'}}>{editingPost ? "UPDATE POST" : "PUBLISH POST"}</button>
                            {editingPost && <button type="button" onClick={()=>{setEditingPost(null);setImages([]);setBlogContentVi("");setBlogContentEn("");setBlogContentJp("")}} style={{...s.btnSecondary, flex: 1}}>CANCEL EDIT</button>}
                        </div>
                    </form>
                </div>
                
                <h2 style={{...s.title, marginBottom: '20px'}}>🗂️ ALL POSTS</h2>
                <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                    {posts.map(post => (
                        <div key={post.id} style={{background:'white', padding:'25px', borderRadius:'15px', border:'1px solid #ffe4e1', display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow: '0 4px 10px rgba(0,0,0,0.02)'}}>
                            <div>
                                <h3 style={{margin:'0 0 8px 0', color:'#5d4037', fontSize: '1.2rem'}}>{post.titleVi} <span style={{color:'#ccc'}}>|</span> {post.titleEn}</h3>
                                <span style={{fontSize:'0.85rem', background:'#fff0f5', padding:'5px 12px', borderRadius:'10px', color:'#ff69b4', fontWeight: 'bold'}}>{post.tag}</span>
                                <span style={{fontSize:'0.85rem', color:'#aaa', marginLeft: '10px'}}>{new Date(post.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{display:'flex', gap:'10px'}}>
                                <button onClick={()=>startEdit(post)} style={s.btnSecondary}>EDIT</button>
                                <button onClick={()=>handleDelete(post.id)} style={{...s.btnDelete, background:'#fff', border:'2px solid #ff4d4f', color:'#ff4d4f', padding: '10px 20px', borderRadius: '30px'}}>DEL</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {/* --- CONTENT TAB --- */}
          {activeTab === 'content' && (
            <div style={{maxWidth:'1200px', margin:'0 auto'}}>
                <div style={{...s.card, borderTop: '4px solid #ff69b4'}}>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom: '25px'}}>
                        <h2 style={s.title}>🎨 EDIT SECTIONS</h2>
                        {msg && <span style={{color:'#d81b60', fontWeight:'bold', background: '#fff0f5', padding: '8px 15px', borderRadius: '20px'}}>{msg}</span>}
                    </div>
                    
                    <form action={handleSectionSubmit}>
                        <div style={{marginBottom:'30px'}}>
                            <label style={s.label}>SELECT SECTION</label>
                            <select name="sectionKey" value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} style={{...s.input, fontSize:'1.1rem', padding:'15px'}}>
                                <option value="global_config">★ GLOBAL CONFIG (Resume, Status)</option>
                                <option value="ai_config">★ AI BRAIN CONFIG (Dual Core)</option>
                                <option value="hero">★ HERO SECTION (Main Info)</option>
                                <option value="about">01. ABOUT ME (Text)</option>
                                <option value="profile">02. PROFILE (Boxes)</option>
                                <option value="career">04. CAREER GOALS (Text)</option>
                                <option value="skills">06. SKILLS (Boxes)</option>
                                <option value="experience">07. EXPERIENCE (CV Style)</option>
                                <option value="contact">11. CONTACT (Boxes)</option>
                                <option value="faq_data">12. FAQ (Q&A)</option>
                            </select>
                        </div>

                        {isHeroSection ? (
                            <div style={s.grid3}>
                                <HeroEditor lang="en" data={heroEn} onUpdate={(f: keyof HeroData, v: string) => updateHero('en', f, v)} />
                                <HeroEditor lang="vi" data={heroVi} onUpdate={(f: keyof HeroData, v: string) => updateHero('vi', f, v)} />
                                <HeroEditor lang="jp" data={heroJp} onUpdate={(f: keyof HeroData, v: string) => updateHero('jp', f, v)} />
                            </div>
                        ) : isConfigSection ? (
                            <div style={s.card}>
                                <h3 style={s.subTitle}>GLOBAL CONFIG</h3>
                                <div><label style={s.label}>Resume URL</label><input value={config.resumeUrl || ""} onChange={e => setConfig({...config, resumeUrl: e.target.value})} style={s.input} /></div>
                                <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'15px'}}>
                                    <label style={{...s.label, marginBottom:0}}>Open For Work?</label>
                                    <input type="checkbox" checked={!!config.isOpenForWork} onChange={e => setConfig({...config, isOpenForWork: e.target.checked})} style={{width:'20px', height:'20px', accentColor: '#ff69b4'}} />
                                </div>
                            </div>
                        ) : isAiConfigSection ? ( 
                            <AiConfigEditor data={aiConfig} onUpdate={updateAiConfig} />
                        ) : isExpSection ? (
                            <div style={s.grid3}>
                                <ExpEditor lang="en" data={expEn} onUpdate={setExpEn} />
                                <ExpEditor lang="vi" data={expVi} onUpdate={setExpVi} />
                                <ExpEditor lang="jp" data={expJp} onUpdate={setExpJp} />
                            </div>
                        ) : isBoxSection ? (
                            <div style={s.grid3}>
                                <BoxEditor lang="en" data={boxesEn} onUpdate={setBoxesEn} titleLabel={sectionKey.toUpperCase()} />
                                <BoxEditor lang="vi" data={boxesVi} onUpdate={setBoxesVi} titleLabel={sectionKey.toUpperCase()} />
                                <BoxEditor lang="jp" data={boxesJp} onUpdate={setBoxesJp} titleLabel={sectionKey.toUpperCase()} />
                            </div>
                        ) : isFaqSection ? (
                            <div style={s.grid3}>
                                <FaqEditor lang="en" data={faqEn} onUpdate={setFaqEn} />
                                <FaqEditor lang="vi" data={faqVi} onUpdate={setFaqVi} />
                                <FaqEditor lang="jp" data={faqJp} onUpdate={setFaqJp} />
                            </div>
                        ) : (
                            <div style={s.grid3}>
                                <div style={s.card}><label style={s.label}>ENGLISH</label><textarea name="contentEn" value={secEn} onChange={e=>setSecEn(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                                <div style={s.card}><label style={s.label}>VIETNAMESE</label><textarea name="contentVi" value={secVi} onChange={e=>setSecVi(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                                <div style={s.card}><label style={s.label}>JAPANESE</label><textarea name="contentJp" value={secJp} onChange={e=>setSecJp(e.target.value)} style={{...s.input, height:'300px'}} /></div>
                            </div>
                        )}

                        <button type="submit" disabled={isSaving} style={{...s.btnPrimary, width:'100%', fontSize:'1.2rem', marginTop:'30px', padding: '15px'}}>{isSaving ? "SAVING..." : "SAVE CHANGES"}</button>
                    </form>
                </div>
            </div>
          )}

          {/* --- ANALYTICS TAB --- */}
          {activeTab === 'analytics' && (
              <div>
                  <h2 style={{...s.title, marginBottom: '30px'}}>📊 ANALYTICS DASHBOARD</h2>
                  
                  <div style={{display: 'flex', gap: '30px', marginBottom: '40px'}}>
                      <div style={{...s.card, flex: 1, textAlign: 'center', borderTop: '4px solid #ff69b4', padding: '40px'}}>
                          <div style={{fontSize: '3rem'}}>👀</div>
                          <h3 style={{color: '#8d6e63', margin: '10px 0'}}>Total Visits</h3>
                          <div style={{fontSize: '3.5rem', fontWeight: 900, color: '#d81b60'}}>{totalVisits}</div>
                      </div>
                      
                      <div style={{...s.card, flex: 2, borderTop: '4px solid #ff69b4'}}>
                          <h3 style={{...s.subTitle, border: 'none', padding: 0}}>🌐 Language Distribution</h3>
                          <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100px'}}>
                              {['vi', 'en', 'jp'].map(l => (
                                  <div key={l} style={{textAlign: 'center'}}>
                                      <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#ff69b4'}}>{langCount[l] || 0}</div>
                                      <div style={{color: '#8d6e63', textTransform: 'uppercase', fontWeight: 'bold'}}>{l}</div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div style={{...s.card, borderTop: '4px solid #ff69b4'}}>
                      <h3 style={{...s.subTitle, border: 'none', padding: 0}}>💬 Recent AI Chat Logs</h3>
                      <div style={{background: '#f9f9f9', borderRadius: '15px', padding: '20px', maxHeight: '500px', overflowY: 'auto'}}>
                          {chatLogs.length === 0 ? (
                              <p style={{textAlign: 'center', color: '#aaa', fontStyle: 'italic'}}>No chat logs yet 🍃</p>
                          ) : (
                              chatLogs.map(log => (
                                  <div key={log.id} style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #eee'}}>
                                      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                                          <span style={{background: log.mode === 'hacker' ? '#111' : '#ffe4e1', color: log.mode === 'hacker' ? '#0f0' : '#ff69b4', padding: '3px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'}}>
                                              {log.mode}
                                          </span>
                                          <span style={{fontSize: '0.85rem', color: '#aaa'}}>{new Date(log.createdAt).toLocaleString()}</span>
                                      </div>
                                      <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                          <span style={{fontSize: '1.2rem'}}>👤</span>
                                          <div style={{background: 'white', padding: '10px 15px', borderRadius: '0 15px 15px 15px', border: '1px solid #ddd', flex: 1}}>
                                              <strong style={{display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '5px'}}>User:</strong>
                                              {log.message}
                                          </div>
                                      </div>
                                      <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                                          <div style={{background: log.mode === 'hacker' ? '#000' : '#fff0f5', color: log.mode === 'hacker' ? '#0f0' : '#d81b60', padding: '10px 15px', borderRadius: '15px 0 15px 15px', border: log.mode === 'hacker' ? '1px solid #0f0' : '1px solid #ffc1e3', flex: 1}}>
                                              <strong style={{display: 'block', fontSize: '0.8rem', color: log.mode === 'hacker' ? '#050' : '#ff69b4', marginBottom: '5px'}}>AI Reply:</strong>
                                              {log.response}
                                          </div>
                                          <span style={{fontSize: '1.2rem'}}>🤖</span>
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                  </div>
              </div>
          )}
          
      </div>
    </div>
  );
}