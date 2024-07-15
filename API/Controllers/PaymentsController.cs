using API.Errors;
using Core.Dtos;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers;

public class PaymentsController : BaseApiController
{
    private const string whSecret = "whsec_e09d34c1ef44a5df5bb85259650e32bca22c1235b8dee1940363ebe33be59577";
    private readonly IPaymentService _paymentService;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
    {
        this._paymentService = paymentService;
        this._logger = logger;
    }

    [Authorize]
    [HttpPost("{cartId}")]
    public async Task<ActionResult<CartDto>> CreateOrUpdatePaymentIntent(string cartId)
    {
        var basket = await _paymentService.CreateOrUpdatePaymentIntnet(cartId);
        if (basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

        return basket;
    }


    [HttpPost("webHook")]
    public async Task<ActionResult> StripeWebHook()
    {
        var json = await new StreamReader(Request.Body).ReadToEndAsync();

        var stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"], whSecret);

        PaymentIntent intent;
        Order order;


        switch (stripeEvent.Type)
        {
            case "payment_intent.succeeded":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment succeeded: {0}", intent.Id);
                order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                _logger.LogInformation("Order updated to payment received: {0}", order.Id);

                break;
            case "payment_intent.payment_failed":
                intent = (PaymentIntent)stripeEvent.Data.Object;
                _logger.LogInformation("Payment failed: {0}", intent.Id);
                order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                _logger.LogInformation("Order updated to payment failed: {0}", order.Id);


                break;
            default:
                break;
        }

        return new EmptyResult();
    }
}
