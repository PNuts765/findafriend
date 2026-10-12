import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms and Conditions | FindAFriend',
  description:
    'Read the Terms and Conditions governing use of FindAFriend and its Pro subscription.',
  robots: {
    index: true,
    follow: true,
  },
};

const sectionStyle = {
  marginTop: '28px',
  lineHeight: 1.75,
} as const;

export default function TermsPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f7f7fa',
        padding: '36px 18px 64px',
        color: '#20212a',
      }}
    >
      <article
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          background: '#fff',
          border: '1px solid #f2d6e0',
          borderRadius: '18px',
          padding: 'clamp(22px, 5vw, 52px)',
          boxShadow: '0 12px 36px rgba(30, 20, 35, 0.07)',
          overflowWrap: 'anywhere',
        }}
      >
        <Link
          href="/"
          style={{
            color: '#e94479',
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          findafriend
        </Link>

        <h1 style={{ fontSize: 'clamp(30px, 5vw, 42px)', marginBottom: 8 }}>
          Terms and Conditions
        </h1>

        <p style={{ color: '#666976', fontSize: 14 }}>
          Effective date: October 11, 2026
        </p>

        <p style={{ lineHeight: 1.8 }}>
          These Terms and Conditions (“Terms”) govern your access to and use
          of FindAFriend, including its website, profiles, messaging, user
          content, and optional Pro features. By accessing or using the
          service, you agree to these Terms. If you do not agree, do not use
          the service.
        </p>

        <section style={sectionStyle}>
          <h2>1. Eligibility</h2>
          <p>
            You must be at least 18 years old and legally able to agree to
            these Terms to create an account or use FindAFriend. By using the
            service, you confirm that you meet these requirements. Do not use
            the service if you are legally prohibited from doing so.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2. Your account</h2>
          <p>
            Provide accurate information when creating and maintaining your
            account. Keep your sign-in credentials secure and promptly take
            steps to protect your account if you suspect unauthorized access.
            You are responsible for activity conducted through your account,
            except where applicable law provides otherwise.
          </p>
          <p>
            Do not impersonate another person, misrepresent your identity,
            create accounts for fraudulent purposes, or use another person’s
            account without permission.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>3. Respectful conduct and safety</h2>
          <p>You agree not to use FindAFriend to:</p>
          <ul>
            <li>Harass, threaten, stalk, intimidate, or exploit another person.</li>
            <li>Engage in hate-based abuse, targeted harassment, or unlawful discrimination.</li>
            <li>Commit fraud, solicit money deceptively, or conduct scams.</li>
            <li>Share intimate or private material without the person’s consent.</li>
            <li>Post illegal content or content involving the sexual exploitation of minors.</li>
            <li>Spam users, distribute malware, or send unsolicited commercial messages.</li>
            <li>Collect personal information about users without a lawful basis or permission where required.</li>
            <li>Use bots, scrape the service, interfere with its security, or attempt unauthorized access.</li>
            <li>Use the service for any unlawful purpose or in a way that violates another person’s rights.</li>
          </ul>
          <p>
            Never send money or sensitive financial information to someone
            you have only met online without independently verifying their
            identity and the legitimacy of the request.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>4. Profiles and user content</h2>
          <p>
            You retain rights you already hold in content you submit, subject
            to the rights necessary to operate the service. By submitting
            content, you grant FindAFriend a non-exclusive, worldwide,
            royalty-free license to host, store, reproduce, display, and
            process that content as reasonably necessary to operate, secure,
            and provide the service.
          </p>
          <p>
            You are responsible for the content you upload or share and must
            have the rights and permissions needed to do so. Do not post
            unlawful, misleading, infringing, abusive, or privacy-violating
            material. Do not upload another person’s photos or personal
            information in a misleading or unauthorized way.
          </p>
          <p>
            You must not use profile customization or HTML features to
            distribute malicious code, deceive users, disrupt the service,
            or bypass security protections.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Reporting and moderation</h2>
          <p>
            FindAFriend may investigate reported activity and may remove
            content, restrict features, suspend accounts, or terminate access
            when reasonably necessary to protect users, enforce these Terms,
            address security concerns, comply with law, or prevent harm.
            Where appropriate and legally permitted, we may provide notice
            or an opportunity to challenge a decision.
          </p>
          <p>
            We do not guarantee that every profile or statement is genuine,
            that every report will result in a particular outcome, or that
            harmful behavior will always be detected. You should use your
            own judgment when interacting with other users.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. FindAFriend Pro subscriptions</h2>
          <p>
            FindAFriend may offer optional paid features through a Pro
            subscription. The prices currently displayed on the Pro page are:
          </p>
          <ul>
            <li><strong>Monthly:</strong> $11.99 per month.</li>
            <li><strong>Yearly:</strong> $49.99 per year.</li>
          </ul>
          <p>
            The price and terms presented during checkout control your
            purchase. Applicable taxes, if any, may be added where required.
            Promotional offers, if presented, may have additional terms.
          </p>
          <p>
            A subscription is recurring and will renew for the displayed
            billing period unless it is canceled before renewal, subject to
            the terms presented at checkout and applicable law. By completing
            checkout, you authorize the payment provider to charge the payment
            method you provide for the subscription and applicable renewal
            charges.
          </p>
          <p>
            Review the checkout screen carefully before paying. If a renewal
            date, cancellation method, or other required billing information
            is not clear, do not complete the purchase until that information
            is available.
          </p>
          <p>
            You may cancel according to the cancellation method made
            available for your subscription. Cancellation generally prevents
            future renewal; it does not necessarily refund a payment already
            processed or end access immediately. Any refund rights required
            by applicable law remain unaffected.
          </p>
          <p>
            Payments may be processed by Stripe or another payment provider
            identified during checkout. Payment-provider terms may also apply.
            Do not share payment-card details in profiles or messages.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>7. Availability and changes</h2>
          <p>
            We may update, improve, suspend, or discontinue features from
            time to time. We do not guarantee uninterrupted availability,
            compatibility with every device, or that every feature will
            remain available indefinitely. We will not use this section to
            remove rights that cannot legally be waived.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>8. Privacy</h2>
          <p>
            Your use of FindAFriend may involve personal information,
            profile details, messages, and uploaded content. We should
            describe our actual collection, use, sharing, retention, and
            deletion practices in a separate Privacy Policy. These Terms
            do not replace that notice or any privacy rights provided by law.
          </p>
          <p>
            Do not share information through the service that you are not
            comfortable disclosing to the intended recipient. Other users
            may copy or capture information you make visible to them.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>9. Intellectual property</h2>
          <p>
            The service’s branding, software, design, and other materials
            may be protected by intellectual-property laws. Except for
            content you own or rights expressly granted to you, you may not
            copy, sell, redistribute, reverse engineer, or exploit the
            service except as permitted by law or with written authorization.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>10. Third-party services</h2>
          <p>
            FindAFriend may rely on third-party services for authentication,
            hosting, storage, analytics, or payments. Those services may be
            governed by their own terms and privacy notices. We are not
            responsible for third-party services to the extent permitted
            by applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>11. Disclaimers</h2>
          <p>
            To the extent permitted by law, FindAFriend is provided on an
            “as is” and “as available” basis. We do not guarantee that you
            will meet a particular person, establish a relationship, receive
            replies, or achieve any particular outcome. Online interactions
            involve risks, and you are responsible for your decisions and
            personal safety.
          </p>
          <p>
            Nothing in these Terms excludes a warranty or consumer protection
            that cannot lawfully be excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>12. Limitation of liability</h2>
          <p>
            To the extent permitted by applicable law, FindAFriend will not
            be liable for indirect, incidental, special, consequential, or
            punitive damages, or for loss of profits, data, goodwill, or
            opportunities arising from use of the service. To the extent
            permitted by law, liability for direct damages will be limited
            to the amount you paid to FindAFriend for the service during
            the 12 months before the event giving rise to the claim.
          </p>
          <p>
            These limitations do not apply where prohibited by law, including
            liability that cannot legally be limited or excluded.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>13. Suspension and termination</h2>
          <p>
            You may stop using FindAFriend at any time. Account deletion,
            subscription cancellation, and payment refunds may be separate
            processes. You remain responsible for charges incurred before
            cancellation becomes effective. We may restrict or terminate
            access for violations of these Terms or where otherwise legally
            justified.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>14. Changes to these Terms</h2>
          <p>
            We may update these Terms as the service or applicable law
            changes. We will update the effective date when we publish
            revisions. Where required by law, we will provide notice or
            obtain consent before changes take effect. Continued use after
            an effective update constitutes acceptance only where legally
            valid.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>15. Applicable law and general terms</h2>
          <p>
            These Terms are subject to applicable law. Mandatory consumer
            rights and legal protections that apply in your jurisdiction
            are not waived by these Terms. If a provision is unenforceable,
            the remaining provisions continue to apply to the extent
            permitted by law. Failure to enforce a provision is not a waiver
            of the right to enforce it later.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>16. Contact</h2>
          <p>
            For questions about these Terms, contact FindAFriend Support at{" "}
            <a href="mailto:therealfindafriend@proton.me" style={{ color: '#d93670' }}>
              therealfindafriend@proton.me
            </a>.
          </p>
        </section>

        <div
          style={{
            borderTop: '1px solid #ececf1',
            marginTop: 36,
            paddingTop: 22,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <Link href="/" style={{ color: '#d93670', fontWeight: 700 }}>
            Back to FindAFriend
          </Link>
          <span style={{ color: '#777986', fontSize: 12 }}>
            FindAFriend Terms and Conditions
          </span>
        </div>
      </article>
    </main>
  );
}