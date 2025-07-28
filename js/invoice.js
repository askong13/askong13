async function downloadInvoice(bookingId) {
    try {
        const bookingDoc = await db.collection('bookings').doc(bookingId).get();
        if (!bookingDoc.exists) {
            alert('Booking not found!');
            return;
        }
        const booking = bookingDoc.data();

        const invoiceHTML = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2>Invoice</h2>
                <p><strong>Booking ID:</strong> ${bookingId}</p>
                <hr>
                <h4>Billed To:</h4>
                <p>
                    ${booking.name}<br>
                    ${booking.email}<br>
                    ${booking.phone}
                </p>
                <hr>
                <h4>Booking Details:</h4>
                <p>
                    <strong>Location:</strong> ${booking.locationName}<br>
                    <strong>Start Date:</strong> ${booking.date}<br>
                    <strong>Duration:</strong> ${booking.duration} days<br>
                    <strong>Service:</strong> ${booking.serviceType}
                </p>
                <hr>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>
            </div>
        `;

        const element = document.createElement('div');
        element.innerHTML = invoiceHTML;
        
        html2pdf(element, {
            margin:       1,
            filename:     `invoice_${bookingId}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        });

    } catch (error) {
        console.error("Error generating invoice:", error);
        alert("Could not generate invoice.");
    }
}
