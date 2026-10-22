# Installing the KOEOS signature

Most clients need the rendered signature pasted in, not the HTML code.

**To copy the rendered signature:**

1. Open `signatures/<your-name>.html` (or `-with-strip.html`) in Chrome, Edge or Safari.
2. Press Ctrl+A (Windows) or Cmd+A (Mac) to select everything on the page.
3. Press Ctrl+C or Cmd+C to copy it.
4. Paste it into the client's signature editor as described below.

The images load from `https://koeos.io/email/`, where they are already hosted.

After installing, send a test email to a Gmail address and to an Outlook address. Check it in light and dark mode, and on a phone.

## Gmail (web)

1. Click the gear icon, then **See all settings**, and open the **General** tab.
2. Under **Signature**, click **Create new** and name it (for example "KOEOS").
3. Click in the signature box and paste the rendered signature.
4. Under **Signature defaults**, choose it for **For new emails use** and **On reply/forward use**.
5. Scroll to the bottom and click **Save Changes**.

The Gmail mobile apps use this web signature for mail sent from the web. The app's own "Mobile signature" setting is plain text only, so leave it empty or paste the contents of `<your-name>.txt`.

## Outlook on the web and the new Outlook for Windows

1. Click the gear icon (**Settings**), then go to **Account** > **Signatures**.
2. Click **+ New signature** and name it.
3. Paste the rendered signature into the editor.
4. Set it as the default for new messages and for replies and forwards.
5. Click **Save**.

## Classic Outlook for Windows (desktop)

1. Go to **File** > **Options** > **Mail** > **Signatures…**
2. Click **New** and name the signature.
3. Paste the rendered signature into the **Edit signature** box.
4. Choose it under **New messages** and **Replies/forwards**, then click **OK**.

To install from the file instead:

1. Close Outlook.
2. Copy `<your-name>.html` into `%APPDATA%\Microsoft\Signatures\` and rename it to `KOEOS.htm`.
3. Reopen Outlook and choose **KOEOS** in the Signatures dialog.

**Note:** classic Outlook can attach remote signature images to each message instead of linking them. If recipients see the wordmark as an attachment, ask your IT administrator about Outlook's "send pictures with document" setting.

## Outlook for Mac

1. Go to **Outlook** > **Settings…** > **Signatures**.
2. Click **+**, name the signature, and paste the rendered signature into the editor.
3. Close the editor. Under **Choose default signature**, set it for **New messages** and **Replies/forwards**.

## Apple Mail (macOS)

1. Go to **Mail** > **Settings…** > **Signatures**.
2. Select your account in the left column and click **+**.
3. Untick **Always match my default message font**. Otherwise Mail restyles the text.
4. Paste the rendered signature into the right-hand pane.
5. Choose the signature from the **Choose Signature** menu for that account.

If the images show as blue question marks in the editor, they will still load for recipients once they are hosted.

## Apple Mail (iOS and iPadOS)

1. Open `<your-name>.html` in Safari on the iPhone or iPad. You can AirDrop it or email it to yourself as an attachment.
2. Touch and hold the text, choose **Select All**, then **Copy**.
3. Go to **Settings** > **Apps** > **Mail** > **Signature** (on older iOS: **Settings** > **Mail** > **Signature**). Choose **All Accounts** or **Per Account**.
4. Clear the existing text and paste.
5. If iOS strips the formatting, shake the phone and tap **Undo Change Attributes**. Formatting is usually kept after that.
6. If the layout still breaks, paste the contents of `<your-name>.txt` instead.

iOS Mail keeps simple formatting but may drop table layout. That's expected; the plain-text fallback carries every detail.
