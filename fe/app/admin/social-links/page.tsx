import SimpleResourceManager from "../simple-resource-manager";

export default function SocialLinksPage() {
  return <SimpleResourceManager resource="social-links" title="Social links" description="Control the external profiles available from the contact section and footer." fields={[{ name: "label", label: "Label" }, { name: "url", label: "URL", type: "url", helper: "Use a complete HTTPS URL." }, { name: "displayOrder", label: "Display order", type: "number" }]} />;
}
