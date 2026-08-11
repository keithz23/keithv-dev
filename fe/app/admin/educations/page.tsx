import SimpleResourceManager from "../simple-resource-manager";

export default function EducationsPage() {
    return <SimpleResourceManager resource="educations" title="Education"
                                  description="Manage degrees, institutions and areas of focus shown in the portfolio timeline."
                                  fields={[{name: "degree", label: "Degree"}, {
                                      name: "institution",
                                      label: "Institution"
                                  }, {name: "focus", label: "Focus"}, {
                                      name: "displayOrder",
                                      label: "Display order",
                                      type: "number"
                                  }]}/>;
}
