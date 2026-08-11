import SimpleResourceManager from "../simple-resource-manager";

export default function ExperiencesPage() {
  return <SimpleResourceManager resource="experiences" title="Experience" description="Maintain roles, timelines and concrete outcomes from your professional history." fields={[{ name: "role", label: "Role" }, { name: "company", label: "Company" }, { name: "location", label: "Location" }, { name: "period", label: "Period" }, { name: "detailLinkLabel", label: "Link label" }, { name: "detailLinkUrl", label: "Link URL", type: "url" }, { name: "displayOrder", label: "Display order", type: "number" }, { name: "highlights", label: "Highlights", type: "lines", helper: "One responsibility or outcome per line." }]} />;
}
