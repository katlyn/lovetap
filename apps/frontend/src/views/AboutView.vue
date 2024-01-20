<template>
  <div class="about">
    <h2>About</h2>
    <p>
      Lovetap allows loved ones to send push notifications to each other - for times when you want to let your loved one
      know that you're thinking of them, but when you might not have any specific message that you need to say. Just a
      small and loving tap on the shoulder to let them know you're there.
    </p>

    <h3>Glossary</h3>
    <p>
      Admittedly the terminology for this project is a bit of a mess, so understandably it may be confusing as well.
      Here's a quick list of some things to get you started.
    </p>
    <dl>
      <dt>Tap</dt>
      <dd>
        A simple notification sent through the service. Consists of only the Receiver name and the name of the user who
        send the Tap.
      </dd>

      <dt>Receiver</dt>
      <dd>
        A place that notifications can be sent to. This is similar to a mailbox. People that know your address can send
        you letters (send Taps), and people you share a key with can access the letters (receive Tap notifications).
        Owners of Receivers are able to change the name of the Receiver as it is displayed on this website
        and in notifications.
      </dd>

      <dt>Invite Code</dt>
      <dd>
        A code that can be used to allow other users or devices to send a Receiver Taps. It should be treated as if it
        was a password.
      </dd>

      <dt>Transfer Code</dt>
      <dd>
        A code that can be used to allow other users or devices to own a Receiver. It should be treated as if it was a
        password.
      </dd>
    </dl>

    <h3>Frequently Asked Questions</h3>
    <p>
      Quite frankly no one has ever asked any of these questions but they're my best guesses at what people would ask if
      they were asking questions.
    </p>
    <details>
      <summary>Why do you need notification permissions?</summary>
      Lovetap requires notification permissions as that is how Taps are shown to you. Without the ability to show you
      notifications, Lovetap wouldn't be able to let you know when someone was thinking about you.
    </details>
    <details>
      <summary>I lost my access to my Receiver, can I get a Transfer Code to recover it?</summary>
      Unfortunately, no. Even if I was able to verify your identity and prove that you are indeed the owner of said
      receiver, the way that Transfer and Invite Codes are stored makes it impossible for me to recover them from the
      database.
    </details>
    <details>
      <summary>What data is stored?</summary>
      No data is stored aside from what is needed for bare functionality. This data is as follows:
      <ul>
        <li>The name of Receivers</li>
        <li>The hashes of Transfer and Invite Codes, as well as the salt used when calculating them</li>
        <li>Details required to send push notifications to user devices</li>
      </ul>
      Some minimal data may also be collected to facilitate maintenance of the service, such as webserver logs.
    </details>

    <h3>Dedication</h3>
    <p>
      Lovetap is a very, very late valentine's day gift ;w;
      I love you emma. hopefully even though this is late, it's not too late for you to like it.
    </p>
  </div>
</template>
