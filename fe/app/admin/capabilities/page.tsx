import SimpleResourceManager from "../simple-resource-manager";

export default function CapabilitiesPage() {
  return <SimpleResourceManager resource="capabilities" title="Capabilities" description="Shape the technical capabilities and service areas presented in the About section." fields={[{ name: "index", label: "Index", helper: "Short editorial index, for example 01." }, { name: "title", label: "Title" }, { name: "detail", label: "Detail", type: "textarea" }, { name: "displayOrder", label: "Display order", type: "number" }]} />;
}
