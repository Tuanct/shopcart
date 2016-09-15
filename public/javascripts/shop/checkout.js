Stripe.setPublishableKey('pk_test_Z2VuRstS9x6082Dg8wwnJ79O');

var $form = $('#checkout-form');
$form.submit(function(event) {
    // Disable the submit button to prevent repeated clicks:
    $form.find('button').prop('disabled', true);

    // Request a token from Stripe:
    Stripe.card.createToken({
    	number: $('#cart-number').val(),
    	cvc: $('#cvc').val(),
    	exp_month: $('#exp-month').val(),
    	exp_year: $('#exp-year').val(),
    	name: $('#cart-name').val(),
    }, stripeResponseHandler);

    // Prevent the form from being submitted:
    return false;
});

function stripeResponseHandler(status, response) {

  if (response.error) { // Problem!

    // Show the errors on the form:
    $('.payment-errors').text(response.error.message);
    $('.payment-errors').removeClass('hidden')
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token ID into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken">').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
};