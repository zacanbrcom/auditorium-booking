import base64
import logging
import mimetypes
import os
import os.path
import pickle
from email.mime.text import MIMEText
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient import errors
from googleapiclient.discovery import build

def get_service():
    """Get an authorized Gmail API service instance.

    Return:
        An authorized Gmail API service instance..
    """

    # If modifying these scopes, delete the file token.pickle.
    SCOPES = [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
    ]

    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)
    return service


def send_message(service, sender, message):
  """Send an email message.

  Args:
    service: Authorized Gmail API service instance.
    user_id: User's email address. The special value "me"
    can be used to indicate the authenticated user.
    message: Message to be sent.

  Return:
    Sent Message.
  """
  try:
      sent_message = (service.users().messages().send(userId=sender, body=message).execute())
      logging.info('Message Id: %s', sent_message['id'])
      return sent_message
  except errors.HttpError as error:
      logging.error('An HTTP error occurred: %s', error)

def create_message(sender, to, subject, message_text):
    """Create a message for an email.
  
    Args:
      sender: Email address of the sender.
      to: Email address of the receiver.
      subject: The subject of the email message.
      message_text: The text of the email message.
    http://docs.python.org/lib/module-smtplib.html
    Return:
      An object containing a base64url encoded email object.
    """
    message = MIMEText(message_text)
    message['to'] = to
    message['from'] = sender
    message['subject'] = subject
    s = message.as_string()
    b = base64.urlsafe_b64encode(s.encode('utf-8'))
    return {'raw': b.decode('utf-8')}

def send_approval(sender, to, auditorium, time_start, time_end):

    """
    Pošle email o schválení rezervace na základě zadaných parametrů
    :param sender: adresa odesílatele
    :param to: adresa příjemce
    :param auditorium:
    1 - Auditorium South
    2 - Auditorium North
    3 - Both
    :param time_start: string ve kterém je čas začátku rezervace
    :param time_end: string ve kterém je čas konce rezervace
    """

    subject = "Approval of your booking of auditorium"

    if auditorium == 1:
        text_auditorium = "Auditorium North"
    elif auditorium == 2:
        text_auditorium = "Auditorium South"
    else:
        text_auditorium = "Auditorium South and Auditorium North"

    text = "Your reservation of {} from {} to {} has been approved!".format(text_auditorium, time_start, time_end)

    service = get_service()
    message = create_message(sender, to, subject, text)
    send_message(service, sender, message)


def send_denial(sender, to, auditorium, time_start, time_end):
    """
    Pošle email o zamítnutí rezervace na základě zadaných parametrů
    :param sender: adresa odesílatele
    :param to: adresa příjemce
    :param auditorium:
    1 - Auditorium South
    2 - Auditorium North
    3 - Both
    :param time_start: string ve kterém je čas začátku rezervace
    :param time_end: string ve kterém je čas konce rezervace
    """

    subject = "Denial of your booking of auditorium"

    if auditorium == 1:
        text_auditorium = "Auditorium North"
    elif auditorium == 2:
        text_auditorium = "Auditorium South"
    else:
        text_auditorium = "Auditorium South and Auditorium North"

    text = "Your reservation of {} from {} to {} has been approved!".format(text_auditorium, time_start, time_end)

    service = get_service()
    message = create_message(sender, to, subject, text)
    send_message(service, sender, message)

def send_request(booker, approver, auditorium, time_start, time_end):
    """
    Send request for the approval of booking.
    Args:
        sender: Email address of the booker (sender)
        to: Email address of the approver (administrator)
        time_start: Starting time of reservation
        time_end: Ending time of reservation
    Return:
        None(Sends request.)
        """
    if auditorium == 1:
        text_auditorium = "North"

    elif auditorium == 2:
        text_auditorium = "South"
    else:
        text_auditorium = "North and South"

    sub_request = "Approval Request"
    text_request = "I would like to reserve {} from {} to {}, please.". format(text_auditorium, time_start, time_end)

    service = get_service()
    message = create_message(booker, approver, sub_request, text_request)
    send_message(service, booker, message)


