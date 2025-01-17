import jsPDF from 'jspdf'

export const printPdf = async (elementProps: string, isHideElement: boolean) => {
  try {
    const element = document.getElementById(elementProps)

    if (element) {
      const { default: html2pdf } = await import('html2pdf.js')
      // Show the content before generating the PDF
      element.style.visibility = 'visible'
      element.style.position = ''

      const options = {
        margin: 10,
        filename: 'report_finance.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }

      // Generate the PDF as a Blob object
      html2pdf()
        .from(element)
        .set(options)
        .toPdf()
        .get('pdf')
        .then((pdf: jsPDF) => {
          pdf.save('history_transaction.pdf') 
          pdf.setProperties({
            title: 'History Transaction',
          })
          // Generate a Blob from the PDF content
          const pdfBlob = pdf.output('blob')

          // Create a URL for the Blob
          const pdfUrl = URL.createObjectURL(pdfBlob)

          // Open the PDF in a new tab
          window.open(pdfUrl, '_blank')

          // Hide the content again after generating the PDF
          if (isHideElement) {
            element.style.visibility = 'hidden'
            element.style.position = 'absolute'
          }
        })
    }
  } catch (error) {
    console.error('Error creating PDF:', error)
  }
}
