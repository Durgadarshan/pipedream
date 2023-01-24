import _ from "lodash";
import roll from "../../roll.app.mjs";

export default {
  key: "roll-find-project",
  name: "Find Project",
  version: "0.0.1",
  description: "Find a project [See the docs here](https://docs.rollhq.com/docs/roll-api#api-url)",
  type: "action",
  props: {
    roll,
    projectId: {
      propDefinition: [
        roll,
        "projectId",
      ],
      optional: true,
    },
    companyId: {
      propDefinition: [
        roll,
        "companyId",
      ],
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The project's title",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The project's description",
      optional: true,
    },
    projectType: {
      propDefinition: [
        roll,
        "projectType",
      ],
      optional: true,
    },
    projectLeadSourceId: {
      propDefinition: [
        roll,
        "projectLeadSourceId",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        roll,
        "projectStatus",
      ],
      optional: true,
    },
    subStatusId: {
      propDefinition: [
        roll,
        "projectStatus",
        (c) => ({
          parentId: c.status.value,
        }),
      ],
      label: "SubStatus Id",
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The hexadecimal (color code)[https://www.w3schools.com/colors/colors_hexadecimal.asp].",
      optional: true,
    },
    value: {
      type: "string",
      label: "Value",
      description: "The project's amount.",
      optional: true,
    },
    jobNumber: {
      type: "string",
      label: "Job Number",
      description: "The identification number of the job.",
      optional: true,
    },
    poNum: {
      type: "string",
      label: "PONum",
      description: "The purchase order number.",
      optional: true,
    },
    projectAtRisk: {
      type: "boolean",
      label: "Project At Risk",
      description: "Whether the project is at risk or not.",
      optional: true,
    },
    projectIsRetainer: {
      type: "string",
      label: "Project Is Retainer",
      description: "Whether the project is retainer or not.",
      options: [
        "Yes",
        "No",
      ],
      optional: true,
    },
    projectRetainerFrequency: {
      type: "integer",
      label: "Project Retainer Frequency",
      description: "The amount of time.",
      optional: true,
    },
    projectRetainerStartDate: {
      type: "string",
      label: "Project Retainer Start Date",
      description: "Specifies the period over the frequency. Date format: `0000-00-00T00:00:00.000Z`",
      optional: true,
    },
    completedDate: {
      type: "string",
      label: "Completed Date",
      description: "The date the project was completed. Date format: `0000-00-00T00:00:00.000Z`",
      optional: true,
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "The date by which the project must be done. Date format: `0000-00-00`",
      optional: true,
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description: "The day by the project must be started. Date format: `0000-00-00`",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description: "The day by the project must be finish. Date format: `0000-00-00`",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      // eslint-disable-next-line no-unused-vars
      roll,
      ...variables
    } = this;

    if (variables.status) variables.status = variables.status.label;
    if (variables.subStatusId) variables.subStatusId = variables.subStatusId.value;
    if (variables.projectAtRisk) variables.projectAtRisk = +variables.projectAtRisk;
    if (variables.projectType) variables.projectType = variables.projectType.toString();

    let projectLength = 0;
    let offset = 0;
    const limit = 50;
    const responseArray = [];

    do {
      const { project } = await this.roll.makeRequest({
        variables: {
          ..._.pickBy(variables),
          limit,
          offset,
        },
        query: "listProjects",
      });

      projectLength = project.length;
      responseArray.push(...project);
      offset += limit;
    } while (projectLength);

    $.export("$summary", "Projects successfully fetched!");
    return responseArray;
  },
};
