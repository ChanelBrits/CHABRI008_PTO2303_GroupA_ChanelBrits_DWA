const form = document.querySelector("[data-form]");
const result = document.querySelector("[data-result]");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const entries = new FormData(event.target);
  const { dividend, divider } = Object.fromEntries(entries);

  const dividendValue = Number(dividend);
  const dividerValue = Number(divider);

  if (isNaN(dividendValue) || isNaN(dividerValue)) {
    const errorMessage =
      "Something critical went wrong. Please reload the page";
    document.body.innerHTML = errorMessage;
    throw new Error(errorMessage);
  } else {
    try {
      if (dividend === "" || divider === "") {
        throw new Error(
          "Division not performed. Both values are required in inputs. Try again"
        );
      }

      if (dividendValue <= 0 || dividerValue <= 0) {
        throw new Error(
          "Division not performed. Invalid number provided. Try again"
        );
      }

      const resultValue = Math.floor(dividend / divider);
      result.innerText = resultValue;
    } catch (error) {
      result.innerText = error.message;

      console.error("Error message:", error.message);
      console.error("Call stack:", error.stack);
    }
  }
});
