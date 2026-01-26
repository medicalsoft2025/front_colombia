import { userService } from "../../../services/api/index.js";
import { aiService } from "../../ai/services/AIService.js";
export const useFieldListOptionsApi = source => {
  const loadOptions = async () => {
    let response;
    switch (source) {
      case "USERS":
        response = await userService.getAll();
        return response.map(user => ({
          label: `${user.first_name || ""} ${user.last_name || ""} ${user.middle_name || ""} ${user.second_last_name || ""}`,
          value: `${user.id}`
        }));
      case "GROQ_MODELS":
        response = await aiService.groqModels();
        const models = response.data.map(model => ({
          ...model,
          label: model.id,
          value: model.id
        }));

        // Group by owned_by
        const grouped = models.reduce((acc, model) => {
          const group = acc.find(g => g.label === model.owned_by);
          if (group) {
            group.items.push(model);
          } else {
            acc.push({
              label: model.owned_by,
              value: model.owned_by,
              items: [model]
            });
          }
          return acc;
        }, []);

        // Sort groups? Optional.
        return grouped;
      default:
        return [];
    }
  };
  return {
    loadOptions
  };
};