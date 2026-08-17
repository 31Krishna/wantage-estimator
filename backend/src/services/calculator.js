const calculateEstimate = (config, answers) => {
  const questions = config.questions;

  const getQuestion = (key) =>
    questions.find((question) => question.key === key);

  const roofArea = Number(answers.roof_area);

  if (!Number.isFinite(roofArea)) {
    throw new Error("Invalid roof area");
  }

  const roofQuestion = getQuestion("roof_area");

  if (
    roofQuestion.min !== undefined &&
    roofArea < roofQuestion.min
  ) {
    throw new Error(
      `Roof area must be at least ${roofQuestion.min} sq ft`
    );
  }

  if (
    roofQuestion.max !== undefined &&
    roofArea > roofQuestion.max
  ) {
    throw new Error(
      `Roof area cannot exceed ${roofQuestion.max} sq ft`
    );
  }

  const materialQuestion = getQuestion("material");
  const pitchQuestion = getQuestion("pitch");
  const layersQuestion = getQuestion("layers");
  const storiesQuestion = getQuestion("stories");

  const material = materialQuestion.options.find(
    (option) => option.value === answers.material
  );

  const pitch = pitchQuestion.options.find(
    (option) => option.value === answers.pitch
  );

  const layers = layersQuestion.options.find(
    (option) => option.value === answers.layers
  );

  const stories = storiesQuestion.options.find(
    (option) => option.value === answers.stories
  );

  if (!material) {
    throw new Error("Invalid material selection");
  }

  if (!pitch) {
    throw new Error("Invalid pitch selection");
  }

  if (!layers) {
    throw new Error("Invalid layers selection");
  }

  if (!stories) {
    throw new Error("Invalid stories selection");
  }

  const materialCost =
    roofArea * material.rate_per_sqft;

  const wasteCost =
    materialCost * config.modifiers.waste_factor;

  const tearOffCost =
    roofArea * (layers.tear_off_per_sqft || 0);

  const subtotal =
    materialCost +
    wasteCost +
    tearOffCost;

  const adjustedCost =
    subtotal *
    pitch.multiplier *
    stories.multiplier;

  const finalCost =
    adjustedCost +
    config.modifiers.permit_flat_fee;

  const spread =
    config.modifiers.range_spread_pct / 100;

  const estimateLow =
    Math.round(finalCost * (1 - spread));

  const estimateHigh =
    Math.round(finalCost * (1 + spread));

  return {
    estimate_low: estimateLow,
    estimate_high: estimateHigh,
  };
};

module.exports = calculateEstimate;