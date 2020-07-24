import newPage from "../newPage";

export default (doc, text, startY, fontSize, lineSpacing) => {

    console.log("6");
    let startX = 57;
    startY += lineSpacing * 2;

    //-------Customer Info text---------------------
    doc.setFontType('bold');
    doc.setFontSize(fontSize);
    doc.text("FACTURACIÓN "+text.billing, startX, startY += lineSpacing + 2);
    startY += lineSpacing;

    doc.setFontType('normal');

    doc.text("Razón social: "+text.billingName, startX, startY);
    startY += lineSpacing;
    doc.text("RFC: "+text.billingRfc, startX, startY);
    startY += lineSpacing;
    doc.text("Dirección: "+text.billingAddress, startX, startY);
    startY += lineSpacing;
    doc.text("Email: "+text.billingEmail, startX, startY);
    startY += lineSpacing;

    // doc.setFontSize(fontSize);

    // startY += lineSpacing * 4;

    // doc.setFontType('normal');
    // let splitText = doc.splitTextToSize(
    //     text.billingEmail,
    //     320
    // );

    // <><>><><>><>><><><><><>>><><<><><><><>
    // new page check before text output
    //const pageHeight = doc.internal.pageSize.height;
    //const endY = pageHeight - 120; // minus footerHeight
    const neededSpacing = lineSpacing ;
    //let neededHeight = splitText.length * doc.internal.getLineHeight();
    //let spaceForLines = Math.floor((endY - startY) / doc.internal.getLineHeight());

    // check if new page is needed right at beginning
    startY = newPage(doc, startY, neededSpacing);

    // <><>><><>><>><><><><><>>><><<><><><><>
    // power algorithm to split long text on multiple pages
    // let textStart;

    // while (endY - startY - neededHeight < 0 && splitText.length > spaceForLines) {
    //     spaceForLines = Math.floor((endY - startY) / doc.internal.getLineHeight());
    //     neededHeight = splitText.length * doc.internal.getLineHeight();

    //     textStart = splitText.slice(0,spaceForLines);
    //     //doc.setFont('WorkSans'); // set font here again, else weirdo things are printed out
    //     doc.text(textStart, startX, startY);

    //     splitText = splitText.slice(spaceForLines);

    //     startY = newPage(doc, startY, neededHeight);
    // }

    // set font here again, else weirdo things are printed out
    //doc.setFont('WorkSans');
    //doc.text(splitText, startX, startY);
    //neededHeight = splitText.length * doc.internal.getLineHeight();
    //startY += neededHeight + lineSpacing;
    startY += lineSpacing;

    return startY;
}
