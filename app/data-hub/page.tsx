import { FileSpreadsheet, Mic, ScanText, Smartphone, Tags, Upload, Workflow } from "lucide-react";
import { Badge, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { requests } from "@/lib/seed-data";

const channels = [
  { title: "OCR paper surveys", icon: ScanText, value: "96", detail: "Auto-extract names, needs, ward, and phone numbers." },
  { title: "CSV / Excel import", icon: FileSpreadsheet, value: "62", detail: "Bulk upload NGO spreadsheets with duplicate checks." },
  { title: "WhatsApp parser", icon: Workflow, value: "218", detail: "Convert field messages into structured requests." },
  { title: "Mobile forms", icon: Smartphone, value: "184", detail: "Offline-ready geo-tagged intake for field teams." },
  { title: "Voice input", icon: Mic, value: "39", detail: "Local language reports transcribed to case records." },
  { title: "Smart dedupe", icon: Tags, value: "12", detail: "Repeated reports merged into confidence signals." }
];

export default function DataHubPage() {
  return (
    <main className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
      <PageHero eyebrow="Smart Data Collection Hub" title="One intake layer for scattered field reality">
        Centralize paper surveys, spreadsheets, WhatsApp updates, voice notes, and field reports into a clean operational queue.
      </PageHero>

      <section className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <Card key={channel.title}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white">
                  <Icon size={21} />
                </div>
                <span className="text-3xl font-semibold">{channel.value}</span>
              </div>
              <h2 className="mt-4 text-lg font-semibold">{channel.title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/62">{channel.detail}</p>
            </Card>
          );
        })}
      </section>

      <section className="mx-auto mt-4 max-w-7xl">
        <Card>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-river"><Upload size={16} /> Unified intake queue</p>
              <h2 className="mt-2 text-2xl font-semibold">Latest normalized community records</h2>
            </div>
            <Badge>Duplicate aware</Badge>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-ink/10 text-ink/50">
                <tr>
                  <th className="py-3">Request</th>
                  <th>City</th>
                  <th>Source</th>
                  <th>People</th>
                  <th>Priority</th>
                  <th>Signals</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id} className="border-b border-ink/8">
                    <td className="max-w-md py-4 font-medium">{request.title}</td>
                    <td>{request.city}</td>
                    <td>{request.source}</td>
                    <td>{request.peopleAffected}</td>
                    <td><Badge tone={request.priorityScore >= 85 ? "rose" : "saffron"}>{request.priorityScore}</Badge></td>
                    <td className="text-ink/60">{request.explanation.slice(0, 2).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  );
}
