// Lightweight payment simulation used by the gateway demo route.
export function authorizePayment(request, response) {
  const amountCents = Number(request.body.amountCents || 0);
  const currency = String(request.body.currency || "USD").toUpperCase();
  const cardToken = String(request.body.cardToken || "");
  const email = String(request.body.email || "").trim();
  const billingPostal = String(request.body.billingPostal || "").trim();

  if (!Number.isInteger(amountCents) || amountCents < 100) {
    response.status(400).json({ error: "invalid_amount", amountCents });
    return;
  }
  if (currency !== "USD") {
    response.status(400).json({ error: "unsupported_currency", currency });
    return;
  }
  if (!cardToken.startsWith("tok_")) {
    response.status(400).json({ error: "invalid_card_token" });
    return;
  }

  const approved = amountCents <= 100_000 && !cardToken.startsWith("tok_test_decline");
  const status = !approved && amountCents <= 250_000 ? "manual_review" : approved ? "authorized" : "declined";
  const statusCode = status === "authorized" ? 200 : status === "manual_review" ? 202 : 402;

  response.status(statusCode).json({
    paymentId: `pay_${Date.now()}`,
    status,
    amountCents,
    currency,
    reason: approved ? "within_gateway_limit" : status === "manual_review" ? "requires_review" : "amount_out_of_range",
    riskSignals: {
      hasEmail: Boolean(email),
      hasBillingPostal: Boolean(billingPostal)
    }
  });
}
