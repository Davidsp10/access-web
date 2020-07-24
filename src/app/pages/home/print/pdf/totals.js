import newPage from "../newPage";

export default (doc, printData, startY, fontSize, lineSpacing) => {
    console.log("5");
    let startX = 57;
    const pageWidth = doc.internal.pageSize.width;
    const endX =  pageWidth - startX;

    const tablecol3X = 460;

    // <><>><><>><>><><><><><>>><><<><><><><>
    // new page check before totals output
    const neededHeight = lineSpacing * 2 + lineSpacing;
    startY = newPage(doc, startY, neededHeight);

    doc.setDrawColor(157, 183, 128);
    doc.setLineWidth(0.5);
    doc.line(startX, startY, endX, startY);

    doc.setFontSize(fontSize);

    startY += lineSpacing * 2;

    doc.text(printData.label.subTotal, tablecol3X, startY, 'right');
    doc.text(printData.invoice.subTotal, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.subTotal) * fontSize - 5;
    doc.setLineWidth(0.5);
    startY += 4;
    
    startY += lineSpacing;
    doc.text(printData.label.shippingCost, tablecol3X, startY, 'right');
    doc.text(printData.invoice.shippingCost, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.shippingCost) * fontSize - 5;
    startY += 4;
    doc.line(startX - 1, startY, endX + 1, startY);
    

    startY += lineSpacing;
    doc.setFontType('bold');
    doc.text(printData.label.total, tablecol3X, startY, 'right');
    doc.text(printData.invoice.total, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.bill) * fontSize - 5;
    startY += 4;
    doc.line(startX - 1, startY, endX + 1, startY);

    startY += 2;
    doc.line(startX -2 , startY, endX + 2, startY);

    startY += lineSpacing;
    doc.setFontType('normal');
    doc.text(printData.label.bill, tablecol3X, startY, 'right');
    doc.text(printData.invoice.bill, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.bill) * fontSize - 5;
    startY += 4;

    startY += lineSpacing;
    doc.text(printData.label.cambio, tablecol3X, startY, 'right');
    doc.text(printData.invoice.cambio, endX, startY, 'right');
    startX = endX - doc.getStringUnitWidth(printData.invoice.cambio) * fontSize - 5;
    
    return startY;
}
