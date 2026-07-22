// Script for Manikonda Branch Landing Pages (FICO, MM, General)
document.addEventListener("DOMContentLoaded", () => {
    setupContactForms();
    setupImmediateCallback();
});

const CONTACT_FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycbzBl_a4ratMgU-fQrBxxTf7xIbSgmCbWPEHWXtZEdMGJe_2g0X3lQ9q55k2BKnaYGQ/exec";
const CRATIO_WEBHOOK_URL = "https://apps.cratiocrm.com/Customize/Webhooks/webhook.php?id=499477";
const THANK_YOU_PAGE_URL = "sap-manikonda-thankyou.html";

function redirectToThankYouPage() {
    window.location.href = THANK_YOU_PAGE_URL;
}

function postLeadPayload(endpoint, payload) {
    const encodedPayload = payload instanceof URLSearchParams
        ? payload
        : new URLSearchParams(payload instanceof FormData ? payload : Object.entries(payload));

    return fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        body: encodedPayload
    });
}

function getLeadPayloadObject(payload) {
    if (payload instanceof FormData) {
        return Object.fromEntries(payload.entries());
    }

    if (payload instanceof URLSearchParams) {
        return Object.fromEntries(payload.entries());
    }

    return { ...payload };
}

async function submitLeadToAllDestinations(payload) {
    const sheetsPromise = postLeadPayload(CONTACT_FORM_ENDPOINT, payload);
    const cratioPayload = getLeadPayloadObject(payload);
    fetch(CRATIO_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify(cratioPayload)
    }).catch((error) => {
        console.error("CRM Error:", error);
    });

    await sheetsPromise;
}

function downloadFile(fileUrl) {
    const downloadLink = document.createElement("a");
    downloadLink.href = fileUrl;
    downloadLink.download = fileUrl.split("/").pop() || "syllabus.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
}

function setupContactPhoneInput(phoneInput) {
    if (!phoneInput) return;

    phoneInput.addEventListener("input", () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
        phoneInput.setCustomValidity("");
    });
}

function validateContactPhone(form) {
    const phoneInput = form.querySelector('input[type="tel"][name="Mobile"]');
    if (!phoneInput) return true;

    const isTenDigits = /^[0-9]{10}$/.test(phoneInput.value.trim());
    phoneInput.setCustomValidity(isTenDigits ? "" : "Enter exactly 10 digits.");

    if (!isTenDigits) {
        phoneInput.reportValidity();
    }

    return isTenDigits;
}

function setupContactForms() {
    document.querySelectorAll(".contact-form").forEach((form) => {
        setupContactPhoneInput(form.querySelector('input[type="tel"][name="Mobile"]'));

        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!validateContactPhone(form)) {
                return;
            }

            const pendingDownloadUrl = document.body.dataset.pendingDownloadUrl || "";
            const formData = new FormData(form);

            if (pendingDownloadUrl) {
                const currentSource = formData.get("Source") || "Manikonda Branch Page";
                formData.set("Source", `${currentSource} - Syllabus Download`);
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonContent = submitButton.innerHTML;

            submitButton.disabled = true;
            submitButton.classList.add("opacity-70", "cursor-not-allowed");
            submitButton.innerHTML = pendingDownloadUrl
                ? '<i class="fa-solid fa-spinner fa-spin"></i> Preparing Download...'
                : '<i class="fa-solid fa-spinner fa-spin"></i> Sending Info...';

            try {
                await submitLeadToAllDestinations(formData);

                if (pendingDownloadUrl) {
                    downloadFile(pendingDownloadUrl);
                    document.body.dataset.pendingDownloadUrl = "";
                    window.setTimeout(redirectToThankYouPage, 300);
                } else {
                    redirectToThankYouPage();
                }
            } catch (error) {
                alert("Sorry, we could not submit your details. Please call us at 8790532776.");
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove("opacity-70", "cursor-not-allowed");
                submitButton.innerHTML = originalButtonContent;
            }
        });
    });
}

function setupImmediateCallback() {
    document.querySelectorAll(".instant-callback-action").forEach((callbackAction) => {
        const phoneInput = callbackAction.querySelector('input[name="Mobile"]');
        const submitButton = callbackAction.querySelector(".instant-callback-submit");
        const statusMessage = callbackAction.parentElement.querySelector(".instant-callback-status");
        if (!phoneInput || !submitButton) return;

        const originalButtonContent = submitButton.innerHTML;
        const pageSourceInput = document.querySelector('.contact-form input[name="Source"]');
        const baseSource = pageSourceInput ? pageSourceInput.value.split('-')[0].trim() : "Manikonda Branch Page";

        function validateImmediateCallbackPhone() {
            const phoneNumber = phoneInput.value.trim();
            const isTenDigits = /^[0-9]{10}$/.test(phoneNumber);
            phoneInput.setCustomValidity(isTenDigits ? "" : "Enter a 10-digit phone number.");
            return isTenDigits;
        }

        async function submitImmediateCallback() {
            if (!validateImmediateCallbackPhone()) {
                phoneInput.reportValidity();
                return;
            }

            submitButton.disabled = true;
            submitButton.classList.add("opacity-70", "cursor-not-allowed");
            submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            if (statusMessage) statusMessage.textContent = "";

            try {
                await submitLeadToAllDestinations({
                    Source: `${baseSource} - Immediate Callback`,
                    Mobile: phoneInput.value.trim(),
                    Message: "Immediate callback requested in less than 10 minutes"
                });

                redirectToThankYouPage();
            } catch (error) {
                if (statusMessage) {
                    statusMessage.textContent = "Sorry, we could not submit your number. Please call us at 8790532776.";
                }
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove("opacity-70", "cursor-not-allowed");
                submitButton.innerHTML = originalButtonContent;
            }
        }

        phoneInput.addEventListener("input", () => {
            phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
            validateImmediateCallbackPhone();
        });

        submitButton.addEventListener("click", submitImmediateCallback);
        phoneInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                submitImmediateCallback();
            }
        });
    });
}
