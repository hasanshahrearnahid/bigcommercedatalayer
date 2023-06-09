
// Step 01
// Go >> Storefront >> Script Manager

// Name of Script: Google Tag manager Script
// Description: Custom GA4 Global Script
// Location: Head
// Select pages where script will be added: All pages
// Script Category: Analytics
// Script Type: Script
// Script Content: Now copy the script from GTM Code and change GTM-00000, paste it into the script content area, and click Save.


<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-00000');</script>
<!-- End Google Tag Manager -->
































// Step 02
// Go >> Storefront >> Script Manager

// Name of Script: GA4 User Properties and Page Events
// Description: Custom Events
// Location: Footer
// Select pages where script will be added: All pages
// Script Category: Analytics
// Script Type: Script
// Script Content: Please copy the code given below and paste into script content section




<script>
------------------------------------------------------------------------------------------------------

    {{#if customer }}
        
        dataLayer.push({
			'user_id' : '{{customer.id}}',
			'customer_shipping_first_name': '{{customer.shipping_address.first_name}}',
			'customer_shipping_last_name': '{{customer.shipping_address.last_name}}',
			'customer_shipping_phone': '{{customer.shipping_address.phone}}',
			'customer_shipping_zip': '{{customer.shipping_address.zip}}',
			'customer_shipping_email': '{{customer.shipping_address.email}}',
			'customer_shipping_street_1': '{{customer.shipping_address.street_1}}',
			'customer_shipping_state': '{{customer.shipping_address.state}}',
            'customer_shipping_city': '{{customer.shipping_address.city}}',
			'customer_shipping_country': '{{customer.shipping_address.country}}',
            'customer_shipping_address_type': '{{customer.shipping_address.destination}}',
			'timestamp'     : Date.now()
        });
    {{/if}}
    {{#if customer.customer_group_name }}
        dataLayer.push({
            'customer_group': '{{customer.customer_group_name}}'
        });
    {{/if}}
	
	
	
	

//signup
{{#if page_type '===' 'createaccount_thanks' }}
        dataLayer.push({
            event    : "signup",
				signup: {
				method: “Email”
				}
				});

{{/if}}

//login
{{#if page_type '===' 'login' }}

	document.querySelector("form[action='/login.php?action=check_login']").addEventListener("submit", function (event) {
			 dataLayer.push({
				event    : "login",
					login: {method: “website”}
			})
		});  
 
{{/if}}

// View_item
{{#if page_type '===' 'product'}}
		dataLayer.push({
		  event: "view_item",
		  ecommerce: {
			items: [
				{
					item_id: "{{#if product.sku}}{{product.sku}}{{else}}{{product.id}}{{/if}}",
					item_name: "{{product.title}}",
					currency: "{{currency_selector.active_currency_code}}",
					discount: parseFloat({{product.price.saved.value}}),
					item_brand: "{{product.brand.name}}",
					price: {{#or customer (unless theme_settings.restrict_to_login)}}{{#if product.price.with_tax}}parseFloat({{product.price.with_tax.value}}){{else}}parseFloat({{product.price.without_tax.value}}){{/if}}{{else}}"{{lang 'common.login_for_pricing'}}"{{/or}},
					google_business_vertical: "retail",
					quantity: 1,
					{{#each product.category}}{{#if @first}}item_category:"{{this}}"{{else}},item_category{{@index}}:"{{this}}"{{/if}}{{/each}}
				}
			]
		  }
		});
{{/if}}

// View_ Cart

{{#if page_type '===' 'cart'}}
		dataLayer.push({
		  event: "view_cart",
			  ecommerce: {
				currency: "{{currency_selector.active_currency_code}}",
				value: parseFloat({{cart.sub_total.value}}),  
				items: [
					{{#each cart.items}}
					{
						item_id: "{{#if sku}}{{sku}}{{else}}{{product_id}}{{/if}}",
						item_name: "{{name}}",
						item_brand: "{{brand.name}}",                    
						price: parseFloat({{price.value}}),
						quantity: parseInt({{quantity}})
					},
					{{/each}}                                        
	           ]
	        } 
		});
	
	
{{/if}}

// Search
{{#if page_type '===' 'search'}}

   dataLayer.push({
            event : "search",
            search: {
                search_term: "{{sanitize forms.search.query}}"
				
            }
        });

{{/if}}
</script>






/////////////************************************//////////////////////




















// Step 3
// Go>> Storefront >> Script Manager
// Step 3: Add GA4 Checkout Steps events to the BigCommerce Optimized One-Page Checkout

// Name of Script: GA4 Checkout Page Events
// Description: Custom Checkout Events
// Location: Footer
// Select pages where script will be added: Checkout
// Script Category: Analytics
// Script Type: Script
// Script Content: Please copy the code given below and paste into script content section



<script>
  (function(win) {
      'use strict';

      var listeners = [], 
      doc = win.document, 
      MutationObserver = win.MutationObserver || win.WebKitMutationObserver,
      observer;

      function ready(selector, fn) {
          // Store the selector and callback to be monitored
          listeners.push({
              selector: selector,
              fn: fn
          });
          if (!observer) {
              // Watch for changes in the document
              observer = new MutationObserver(check);
              observer.observe(doc.documentElement, {
                  childList: true,
                  subtree: true
              });
          }
          // Check if the element is currently in the DOM
          check();
      }

      function check() {
          // Check the DOM for elements matching a stored selector
          for (var i = 0, len = listeners.length, listener, elements; i < len; i++) {
              listener = listeners[i];
              // Query for elements matching the specified selector
              elements = doc.querySelectorAll(listener.selector);
              for (var j = 0, jLen = elements.length, element; j < jLen; j++) {
                  element = elements[j];
                  // Make sure the callback isn't invoked with the 
                  // same element more than once
                  if (!element.ready) {
                      element.ready = true;
                      // Invoke the callback with the element
                      listener.fn.call(element, element);
                  }
              }
          }
      }

      // Expose `ready`
      win.ready = ready;

  })(this);

  // Global Variable to store Items for each step
  window.orderData = window.orderData || [];


  // Begin Checkout - Fire on page load
  fetch('/api/storefront/checkouts/{{checkout.id}}', {
          credentials: 'include'
      }).then(function (response) {
          return response.json();
      }).then(function (data) {
          window.orderData.push(data);
          const orderItems = window.orderData[0].cart.lineItems.physicalItems.map(item => {
              const container = {};
              container['item_id'] = Boolean(item.sku)? item.sku : item.productId;
              container['item_name'] = item.name;
              container['price'] = item.salePrice;
              container['quantity'] = item.quantity;
              return container;
          });
		  
		//begin_checkout
		dataLayer.push({
		  event: "begin_checkout",
		  ecommerce: { 
				currency: window.orderData[0].cart.currency.code,
				value: window.orderData[0].subtotal,
				coupon: window.orderData[0].coupons.length > 0 ? window.orderData[0].coupons[0].code:'',
				items: orderItems
           }
		});  
		  
		  

            
  });


  ready('.paymentMethod', function(element) {

  // Shipping Info Added event gets fired when payment section is loaded        
  fetch('/api/storefront/checkouts/{{checkout.id}}', {
      credentials: 'include'
  }).then(function (response) {
      return response.json();
  }).then(function (data) {
      window.orderData.push(data);
      const orderItems = window.orderData[1].cart.lineItems.physicalItems.map(item => {
          const container = {};
          container['item_id'] = Boolean(item.sku)? item.sku : item.productId;
          container['item_name'] = item.name;
          container['price'] = item.salePrice;
          container['quantity'] = item.quantity;
          return container;
      });

	//add_shipping_info
	dataLayer.push({
	  event: "add_shipping_info",
      ecommerce: { 
			currency: window.orderData[1].cart.currency.code,
			value: window.orderData[1].subtotal,
			coupon: window.orderData[1].coupons.length > 0 ? window.orderData[1].coupons[1].code:'',
			shipping_tier: window.orderData[1].consignments[0].selectedShippingOption.description,
			items: orderItems
		   }
	});  

	  
  }); // fetch function ends

  // Add Payment Info event gets fired when Place Order Button is clicked
  var paymentButton = document.getElementById('checkout-payment-continue');
  if (paymentButton){
      paymentButton.addEventListener("click", function(e) {
          let paymentOptions = document.querySelector('.checkout-step--payment .optimizedCheckout-form-checklist-item--selected input[type="radio"]');

          const orderItems = window.orderData[1].cart.lineItems.physicalItems.map(item => {
              const container = {};
              container['item_id'] = Boolean(item.sku)? item.sku : item.productId;
              container['item_name'] = item.name;
              container['price'] = item.salePrice;
              container['quantity'] = item.quantity;
              return container;
          });
		  
			dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
			dataLayer.push({
			  event: "add_payment_info",
			  ecommerce: { 
				  currency: window.orderData[1].cart.currency.code,
				  payment_type: Boolean(paymentOptions.value) ? paymentOptions.value : 'default',
				  value: window.orderData[1].subtotal,
				  coupon: window.orderData[1].coupons.length > 0 ? window.orderData[1].coupons[1].code:'',
				  shipping_tier: window.orderData[1].consignments[0].selectedShippingOption.description,	
				  items: orderItems
			   }
			});  
	  
      }); // click event ends
  } // if condition ends

  }); // Ready function ends
  </script>
  
  
 
  
  
 ///////*****************************************////////////////////////// 





























// Step 4 
// Go>> Storefront >> Script Manager 

// Step 4: Add GA4 eCommerce Conversion Tracking on BigCommerce order confirmation page
// Name of Script: GA4 Conversion Tracking
// Description: Custom GA4 Purchase Event
// Location: Footer
// Select pages where script will be added: Order confirmation
// Script Category: Analytics
// Script Type: Script
// Script Content: Please copy the code given below and paste into script content section



<script>    

	dataLayer.push({
		'user_id' : '{{customer.id}}',
		'customer_shipping_first_name': '{{customer.shipping_address.first_name}}',
		'customer_shipping_last_name': '{{customer.shipping_address.last_name}}',
		'customer_shipping_phone': '{{customer.shipping_address.phone}}',
		'customer_shipping_zip': '{{customer.shipping_address.zip}}',
		'customer_shipping_email': '{{customer.shipping_address.email}}',
		'customer_shipping_street_1': '{{customer.shipping_address.street_1}}',
		'customer_shipping_state': '{{customer.shipping_address.state}}',
		'customer_shipping_city': '{{customer.shipping_address.city}}',
		'customer_shipping_country': '{{customer.shipping_address.country}}',
		'customer_shipping_address_type': '{{customer.shipping_address.destination}}',
		'timestamp'     : Date.now()
	});

  // Fetch Order Data
     
  fetch('/api/storefront/order/{{checkout.order.id}}', {
    credentials: 'include'
  }).then(function (response) {
    return response.json();
  }).then(function (orderData) {
    const orderItems = orderData.lineItems.physicalItems.map(item => {
        const container = {};
        container['item_id'] = Boolean(item.sku)? item.sku : item.id;
        container['item_name'] = item.name;
        container['price'] = item.salePrice;
        container['quantity'] = item.quantity;
		container['google_business_vertical'] = "retail";
		
		
        return container;
    }); 


	//purchase
	dataLayer.push({
	  event: "purchase",
	  ecommerce: {
			transaction_id: '{{checkout.order.id}}',
			value: orderData.orderAmount,
			tax: orderData.taxTotal,
			shipping: orderData.shippingCostTotal,
			currency: orderData.currency.code,
			coupon: orderData.coupons.length > 0 ? orderData.coupons[0].code:'',
			items: orderItems		  
				
	   }
	});  


  });
  </script>
  
  
  
///// Track Search Results query within Quick Results popup // 
































  
// Step 5
// Go>> Storefront >> themes >> copy theme >> Edit theme /templates/components/search/quick-results.html
  

   <script>
   dataLayer.push({
            event : "search",
            search: {
                search_term: "{{sanitize forms.search.query}}"	
            }
        });
  </script>
  
  
  
  
 ///// Track Product Views in Quick View // 
  
































// Step 6
// Track Search Results query within Quick Results popup


// Go>> Storefront >> themes >> copy theme >> Edit theme /templates/components/products/quick-view.html



  <!-- File Path for Cornerstone Theme: /templates/components/products/quick-view.html -->
  <script type="text/javascript">
  		dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
		dataLayer.push({
		  event: "view_item",
		  ecommerce: {
			items: [
				{
					item_id: "{{#if product.sku}}{{product.sku}}{{else}}{{product.id}}{{/if}}",
					item_name: "{{product.title}}",
					currency: "{{currency_selector.active_currency_code}}",
					discount: parseFloat({{product.price.saved.value}}),
					item_brand: "{{product.brand.name}}",
					price: {{#or customer (unless theme_settings.restrict_to_login)}}{{#if product.price.with_tax}}parseFloat({{product.price.with_tax.value}}){{else}}parseFloat({{product.price.without_tax.value}}){{/if}}{{else}}"{{lang 'common.login_for_pricing'}}"{{/or}},
					google_business_vertical: "retail",
					quantity: 1,
					{{#each product.category}}{{#if @first}}item_category:"{{this}}"{{else}},item_category{{@index}}:"{{this}}"{{/if}}{{/each}}
				}
			]
		 }	
  });
  </script>
  
  
  
   
 ///// Track Ajax Add to Cart Event // 














  
// Step 7
// Track Search Results query within Quick Results popup

// Go>> Storefront >> themes >> copy theme >> Edit theme /templates/components/cart/preview.html 
  
    <!-- File Path for Cornerstone Theme: /templates/components/cart/preview.html -->
  <script type="text/javascript">
  		dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
		dataLayer.push({
		  event: "add_to_cart",
		  ecommerce: {
			items: [
			  {
				item_id: "{{#if cart.added_item.sku}}{{cart.added_item.sku}}{{else}}{{cart.added_item.id}}{{/if}}",
				item_name: "{{cart.added_item.name}}",
				currency: "{{currency_selector.active_currency_code}}",
				item_brand: "{{cart.added_item.brand.name}}",
				google_business_vertical: "retail",
				price: parseFloat({{cart.added_item.price.value}}),
				quantity: parseInt({{cart.added_item.quantity}})
			  }
			]
		  }
  });
  </script>
  
  
  
   ///// Track cart view in AJAX cart preview // 

  




















// Step 8
// Track Search Results query within Quick Results popup

// Go>> Storefront >> themes >> copy theme >> Edit theme /templates/components/common/cart-preview.html 


	<!-- File Path for Cornerstone Theme: /templates/components/common/cart-preview.html -->
	 <script type="text/javascript">
			dataLayer.push({
			  event: "view_cart",
			  ecommerce: {
				currency: "{{currency_selector.active_currency_code}}",
                value: parseFloat({{cart.sub_total.value}}),
				items: [
				{{#each cart.items}}
				{
					item_id: "{{#if sku}}{{sku}}{{else}}{{product_id}}{{/if}}",
					item_name: "{{name}}",
					item_brand: "{{brand.name}}",                    
					price: parseFloat({{price.value}}),
					quantity: parseInt({{quantity}})
					},
				{{/each}}                                        
				]
			  }	
			});
	</script>



