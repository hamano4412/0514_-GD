export type StudentId = "A" | "B" | "C" | "D";

export type AxisKey = "initiative" | "leadership" | "cognition";

export const AXIS_LABEL: Record<AxisKey, string> = {
  initiative: "主体性",
  leadership: "リーダーシップ",
  cognition: "認知能力",
};

export type Utterance = {
  id: string;
  studentId: StudentId;
  /** 秒単位 */
  startSec: number;
  endSec: number;
  text: string;
};

export type Highlight = {
  id: string;
  axis: AxisKey;
  /** 重要度: high なら「評価の決め手」レベル */
  weight: "high" | "medium";
  utteranceId: string;
  /** AI が抽出した「なぜ重要か」の解説 */
  rationale: string;
};

export type StudentEvaluation = {
  id: StudentId;
  displayName: string;
  scores: Record<AxisKey, number>;
  summary: Record<AxisKey, string>;
  highlightIds: string[];
};

export type Session = {
  id: string;
  topic: string;
  conductedAt: string;
  durationSec: number;
  videoUrl: string;
  participants: StudentEvaluation[];
  utterances: Utterance[];
  highlights: Highlight[];
};

const utterances: Utterance[] = [
  {
    id: "u01",
    studentId: "A",
    startSec: 12,
    endSec: 28,
    text: "まず時間配分を決めませんか。前半20分で論点出し、後半20分で結論まとめという形で進めたいです。",
  },
  {
    id: "u02",
    studentId: "B",
    startSec: 30,
    endSec: 41,
    text: "賛成です。論点出しのフェーズでは、まずお題の前提を揃えるところから始めるのがよさそうです。",
  },
  {
    id: "u03",
    studentId: "C",
    startSec: 44,
    endSec: 58,
    text: "うーん、いきなり前提を揃えるより、思いついたアイデアを並べる方が早い気もしますが…どうでしょう。",
  },
  {
    id: "u04",
    studentId: "A",
    startSec: 60,
    endSec: 78,
    text: "結論から言うと、前提揃えを5分だけやってからアイデア出しに入るのが両立できると思います。Dさんはどう思いますか?",
  },
  {
    id: "u05",
    studentId: "D",
    startSec: 80,
    endSec: 92,
    text: "あ、はい。私もそれでいいと思います。Aさんの言う通り5分なら時間ロスも少ないので。",
  },
  {
    id: "u06",
    studentId: "B",
    startSec: 110,
    endSec: 134,
    text: "前提として、ターゲット顧客を20代に絞ったほうが施策を具体化しやすいです。理由は購買行動データが取りやすく、検証サイクルが早いからです。",
  },
  {
    id: "u07",
    studentId: "C",
    startSec: 138,
    endSec: 156,
    text: "なるほど、それなら例えばSNS連動キャンペーンとか、サブスク型の試供品配布とか、色々考えられそうですね。とりあえず出してみますか。",
  },
  {
    id: "u08",
    studentId: "D",
    startSec: 160,
    endSec: 168,
    text: "私は…えーと、口コミを使った施策とかが良いんじゃないかと思います。",
  },
  {
    id: "u09",
    studentId: "A",
    startSec: 172,
    endSec: 195,
    text: "今出てる案を整理すると、SNS・サブスク・口コミの3軸ですね。要するに『新規接点をどう作るか』が論点になっています。この軸で優先度を付けませんか。",
  },
  {
    id: "u10",
    studentId: "B",
    startSec: 200,
    endSec: 224,
    text: "優先度の判定基準は『初期コスト』と『再現性』の2つでいいと思います。サブスクは初期コスト高いけど再現性は高い、口コミは逆、SNSは両方中程度です。",
  },
  {
    id: "u11",
    studentId: "C",
    startSec: 230,
    endSec: 244,
    text: "それで言うと、口コミは再現性が低いから一旦外して、SNSとサブスクで比べる方が早そうですね。",
  },
  {
    id: "u12",
    studentId: "D",
    startSec: 248,
    endSec: 256,
    text: "あ、でも口コミも条件次第では…いや、確かに再現性は弱いかもしれないですね。",
  },
  {
    id: "u13",
    studentId: "A",
    startSec: 260,
    endSec: 282,
    text: "Dさん、口コミを推した理由をもう少し聞かせてもらえますか? 評価軸を変えれば残せるかもしれないので。",
  },
  {
    id: "u14",
    studentId: "D",
    startSec: 286,
    endSec: 308,
    text: "はい、口コミは『信頼性』という観点だと強いと思っていて、購買の最後の一押しになる場面が多いからです。なので、SNSと組み合わせる前提なら残せるかなと。",
  },
  {
    id: "u15",
    studentId: "B",
    startSec: 312,
    endSec: 332,
    text: "それは納得感あります。仮説としては『SNSで接点を作り、口コミで信頼を担保し、サブスクで継続させる』というファネル設計になりそうですね。",
  },
  {
    id: "u16",
    studentId: "A",
    startSec: 338,
    endSec: 360,
    text: "まとめると、3施策を独立ではなくファネルとして組むのが結論です。残り時間で各フェーズのKPIを1つずつ決めて、発表の骨子にしましょう。",
  },
];

const highlights: Highlight[] = [
  {
    id: "h01",
    axis: "initiative",
    weight: "high",
    utteranceId: "u01",
    rationale:
      "議論開始直後の沈黙を破り、自ら時間配分の提案で口火を切っている。最初の主体性シグナルとして強い。",
  },
  {
    id: "h02",
    axis: "leadership",
    weight: "high",
    utteranceId: "u04",
    rationale:
      "対立しかけた2案を統合する妥協案を提示しつつ、発言の少ないDに直接意見を求めている。合意形成と巻き込みの両方を満たす。",
  },
  {
    id: "h03",
    axis: "cognition",
    weight: "high",
    utteranceId: "u09",
    rationale:
      "発散したアイデアを『新規接点をどう作るか』という上位概念で抽象化し、論点を明確化している。構造化能力が読み取れる。",
  },
  {
    id: "h04",
    axis: "leadership",
    weight: "medium",
    utteranceId: "u13",
    rationale:
      "一度棄却されかけた意見を再度引き出すために、Dの発言意図を確認している。少数意見を尊重する姿勢が見える。",
  },
  {
    id: "h05",
    axis: "cognition",
    weight: "high",
    utteranceId: "u15",
    rationale:
      "Dの『信頼性』という観点を取り入れ、3施策をファネル構造として仮説化。論理飛躍なく統合できている。",
  },
  {
    id: "h06",
    axis: "initiative",
    weight: "medium",
    utteranceId: "u06",
    rationale:
      "誰も問わなかった『前提条件』を能動的に提示し、議論の土台を作っている。受動的に流されない積極性。",
  },
  {
    id: "h07",
    axis: "cognition",
    weight: "medium",
    utteranceId: "u10",
    rationale:
      "判定基準を2軸に絞り込み、各案の特性を簡潔に評価。MECE 寄りの整理ができている。",
  },
  {
    id: "h08",
    axis: "initiative",
    weight: "medium",
    utteranceId: "u14",
    rationale:
      "問われて答える形ではあるが、自分の意見の根拠を構造的に説明し直しており、消極性からの回復が見られる。",
  },
];

const participants: StudentEvaluation[] = [
  {
    id: "A",
    displayName: "学生A",
    scores: { initiative: 4.5, leadership: 4.7, cognition: 4.2 },
    summary: {
      initiative: "議論の口火を3回切っており、停滞時にも進行案を提示。総発話量も最多。",
      leadership: "発言が少ない参加者(D)に2度直接質問し、対立案の統合も主導している。",
      cognition: "発散した論点を上位概念で構造化する力が高い。一方で具体的KPIへの落とし込みは他メンバー任せ。",
    },
    highlightIds: ["h01", "h02", "h03", "h04"],
  },
  {
    id: "B",
    displayName: "学生B",
    scores: { initiative: 3.8, leadership: 3.2, cognition: 4.6 },
    summary: {
      initiative: "前提条件・評価軸を能動的に提示。口火を切る回数は少ないが、議論の質を上げる発言が多い。",
      leadership: "他者の意見を否定せず統合するスタンス。一方で他者を巻き込む行動はやや少なめ。",
      cognition: "結論ファーストで根拠を構造的に説明する傾向が強く、ファネル仮説の言語化も担っている。",
    },
    highlightIds: ["h06", "h05", "h07"],
  },
  {
    id: "C",
    displayName: "学生C",
    scores: { initiative: 3.5, leadership: 2.8, cognition: 3.0 },
    summary: {
      initiative: "発言頻度は中程度。提案ベースよりリアクション中心の発話が多い。",
      leadership: "他者の意見を引き出す発言は限定的。否定的反応の前に確認質問を挟むと改善余地あり。",
      cognition: "判断は早いが論拠の提示が弱く、口コミ案を再現性のみで棄却するなど早合点の傾向。",
    },
    highlightIds: [],
  },
  {
    id: "D",
    displayName: "学生D",
    scores: { initiative: 2.4, leadership: 2.0, cognition: 3.6 },
    summary: {
      initiative: "自発的発言は少なく、問われて答える形が中心。総発話量も最少。",
      leadership: "場を動かす行動はほぼ見られない。",
      cognition: "問われた際の説明は構造的で、口コミの『信頼性』という観点提示は最終結論に組み込まれた。",
    },
    highlightIds: ["h08"],
  },
];

export const session: Session = {
  id: "session-2026-05-14-01",
  topic: "若年層向け新商品の認知拡大施策を考えよ(時間:40分)",
  conductedAt: "2026-05-14 10:00",
  durationSec: 40 * 60,
  videoUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  participants,
  utterances,
  highlights,
};

export function getUtterance(id: string): Utterance | undefined {
  return session.utterances.find((u) => u.id === id);
}

export function getHighlight(id: string): Highlight | undefined {
  return session.highlights.find((h) => h.id === id);
}

export function getStudent(id: StudentId): StudentEvaluation | undefined {
  return session.participants.find((p) => p.id === id);
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export type SessionStatus = "analyzed" | "processing" | "queued";

export type SessionMeta = {
  id: string;
  conductedAt: string;
  topic: string;
  participantCount: number;
  durationSec: number;
  status: SessionStatus;
  /** analyzed: 解析完了時刻 / processing: 進捗% / queued: 開始予定 */
  statusDetail?: string;
  highlightCount?: number;
};

export const sessions: SessionMeta[] = [
  {
    id: session.id,
    conductedAt: session.conductedAt,
    topic: session.topic,
    participantCount: session.participants.length,
    durationSec: session.durationSec,
    status: "analyzed",
    statusDetail: "2026-05-14 10:48 解析完了",
    highlightCount: session.highlights.length,
  },
  {
    id: "session-2026-05-14-02",
    conductedAt: "2026-05-14 11:00",
    topic: "リモートワーク下で若手の生産性をどう測定するか(時間:40分)",
    participantCount: 4,
    durationSec: 40 * 60,
    status: "processing",
    statusDetail: "78% — 話者分離中",
  },
  {
    id: "session-2026-05-14-03",
    conductedAt: "2026-05-14 14:00",
    topic: "サブスクサービスの解約率を半年で半減させる施策(時間:40分)",
    participantCount: 4,
    durationSec: 40 * 60,
    status: "queued",
    statusDetail: "解析待ち(キュー2件目)",
  },
  {
    id: "session-2026-05-13-01",
    conductedAt: "2026-05-13 15:30",
    topic: "ChatGPTを業務に導入するROIを示せ(時間:40分)",
    participantCount: 4,
    durationSec: 40 * 60,
    status: "analyzed",
    statusDetail: "2026-05-13 16:18 解析完了",
    highlightCount: 6,
  },
];

export const STATUS_LABEL: Record<SessionStatus, string> = {
  analyzed: "解析完了",
  processing: "解析中",
  queued: "解析待ち",
};

export function formatConductedAt(s: string): {
  date: string;
  time: string;
  weekday: string;
} {
  const [d, t = ""] = s.split(" ");
  const date = new Date(`${d}T${t || "00:00"}:00`);
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return {
    date: d,
    time: t,
    weekday: isNaN(date.getTime()) ? "" : weekdays[date.getDay()],
  };
}
