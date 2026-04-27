import { Bot, MessageSquareText, Send, Sparkles } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";

const conversations = [
  {
    prompt: "Show top urgent areas in Mumbai",
    answer: "Kurla L has priority 98 due to flood risk, 420 people affected, high vulnerability, and repeated WhatsApp reports."
  },
  {
    prompt: "Which volunteers can handle tomorrow's medical camp?",
    answer: "Sana Qureshi ranks highest with nursing, first aid, senior care, counseling, Hindi, Marathi, and 91 reliability."
  },
  {
    prompt: "Predict food shortage zones next week",
    answer: "Delhi Yamuna Pushta should receive preventive ration staging, followed by Kurla if flood disruption continues."
  },
  {
    prompt: "Who are our best teaching volunteers?",
    answer: "Ishita Rao is the strongest current teaching match with verified teaching, childcare, translation, and Marathi."
  }
];

export default function AssistantPage() {
  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="AI Chat Assistant" title="Ask operational questions in natural language">
        Dispatchers can query urgent areas, volunteer fit, predicted shortages, NGO performance, and donor-ready impact summaries.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <p className="flex items-center gap-2 text-sm font-medium text-river"><Sparkles size={16} /> Suggested commands</p>
          <div className="mt-4 space-y-3">
            {conversations.map((item) => (
              <div key={item.prompt} className="rounded-lg border border-ink/10 bg-white/75 p-3 text-sm font-medium">{item.prompt}</div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-field p-4 text-sm leading-6 text-ink/62">
            Production integration can connect LangChain or another RAG layer to requests, volunteers, assignments, route data, and reports.
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm font-medium text-leaf"><Bot size={16} /> SevaSync Copilot</p>
            <Badge>Field-aware</Badge>
          </div>
          <div className="mt-5 space-y-4">
            {conversations.map((item) => (
              <div key={item.prompt} className="space-y-2">
                <div className="ml-auto max-w-[82%] rounded-lg bg-ink px-4 py-3 text-sm text-white">
                  <p className="flex items-center gap-2"><MessageSquareText size={15} /> {item.prompt}</p>
                </div>
                <div className="max-w-[88%] rounded-lg border border-ink/10 bg-white/80 px-4 py-3 text-sm leading-6 text-ink/68">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm text-ink/45">
            Ask about needs, volunteers, routes, predictions, or reports
            <Send className="ml-auto text-leaf" size={16} />
          </div>
        </Card>
      </section>
    </main>
  );
}
