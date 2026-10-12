import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy | FindAFriend',
  description:
    'FindAFriend rules on age eligibility, illegal activity, prohibited content, user safety, and abuse reporting.',
  robots: { index: true, follow: true },
};

const sectionStyle = {
  marginTop: '28px',
  lineHeight: 1.8,
} as const;

export default function AcceptableUsePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f7f7fa',
      color: '#20212a',
      padding: '36px 18px 64px',
    }}>
      <article style={{
        maxWidth: 850,
        margin: '0 auto',
        background: '#fff',
        border: '1px solid #f2d6e0',
        borderRadius: 18,
        padding: 'clamp(22px, 5vw, 52px)',
        boxShadow: '0 12px 36px rgba(30,20,35,0.07)',
        overflowWrap: 'anywhere',
      }}>
        <Link href="/" style={{
          color: '#e94479',
          fontWeight: 800,
          textDecoration: 'none',
        }}>
          findafriend
        </Link>

        <h1 style={{
          fontSize: 'clamp(30px, 5vw, 42px)',
          lineHeight: 1.2,
          marginBottom: 10,
        }}>
          Acceptable Use Policy
        </h1>

        <p style={{ color: '#666976', fontSize: 14 }}>
          Effective date: October 11, 2026
        </p>

        <p style={{ lineHeight: 1.8 }}>
          This Acceptable Use Policy (“AUP”) explains the conduct and content
          that are prohibited on FindAFriend, including profiles, photos,
          messages, comments, custom profile features, and other areas of the
          service. It applies to every user, whether using free or paid features.
          Violations may result in content removal, account restrictions,
          suspension, termination, or reports to appropriate authorities where
          warranted.
        </p>

        <section style={sectionStyle}>
          <h2>1. Age restrictions</h2>
          <p>
            FindAFriend is strictly for adults aged 18 and older. Anyone under
            18 may not create an account, maintain a profile, use messaging,
            upload content, or otherwise use the service. Users must not lie
            about their age or help a minor gain access. Do not solicit, groom,
            sexualize, exploit, or attempt to arrange sexual contact with a minor.
            Accounts reasonably suspected of belonging to minors may be
            restricted or removed.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>2. Illegal acts and unlawful activity</h2>
          <p>You may not use FindAFriend to plan, promote, facilitate, threaten,
            or commit unlawful acts. Prohibited activity includes, but is not
            limited to:</p>
          <ul>
            <li>Threats, stalking, harassment, extortion, or intimidation.</li>
            <li>Fraud, identity theft, impersonation, phishing, or financial scams.</li>
            <li>Trafficking, exploitation, coercion, or forced labor.</li>
            <li>Distributing malware or attempting unauthorized access to accounts or systems.</li>
            <li>Violating another person's privacy, intellectual property, or other legal rights.</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2>3. Sexually explicit content</h2>
          <p>
            Sexually explicit profile content is prohibited. Do not upload,
            display, send, or solicit pornography, explicit sexual images or
            videos, graphic depictions of sexual acts, or sexually explicit
            profile text. Do not use profile customization, HTML, links, or
            other features to bypass this restriction or direct users to
            prohibited sexual content.
          </p>
          <p>
            Non-explicit adult dating or relationship discussion must still
            comply with this AUP and all other applicable rules.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>4. Child sexual exploitation and abuse</h2>
          <p>
            Any child sexual abuse or exploitation material is strictly
            prohibited, including sexual images or depictions of minors,
            grooming, sexual solicitation of minors, and attempts to arrange
            sexual exploitation. Do not request, create, possess, upload,
            share, promote, or link to such material. Do not use age
            misrepresentation to sexualize or target minors.
          </p>
          <p>
            FindAFriend may remove relevant material, preserve information
            where appropriate and lawful, restrict accounts, and report
            suspected child exploitation to the appropriate authorities.
            Do not download, copy, or redistribute suspected abuse material.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>5. Sexual violence, coercion, and threats</h2>
          <p>
            Content that threatens, promotes, celebrates, encourages, or
            facilitates sexual assault, rape, sexual coercion, or other
            non-consensual sexual conduct is prohibited. Do not threaten
            sexual violence, pressure another user into sexual activity,
            or use blackmail or intimidation to obtain sexual material
            or contact.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>6. Non-consensual intimate content</h2>
          <p>
            Do not post, threaten to post, distribute, or solicit intimate
            images, sexual recordings, or private sexual material without
            the consent of the person depicted. This includes intimate
            material obtained through deception, coercion, hidden recording,
            account compromise, or other privacy violations. Do not use
            intimate material to threaten, humiliate, blackmail, or control
            another person.
          </p>
          <p>
            Reports involving intimate material shared without consent may
            be prioritized for review and removal. FindAFriend will respond
            to valid legal removal requests as required by applicable law.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>7. Human trafficking and sexual exploitation</h2>
          <p>
            You may not use the service to recruit, advertise, arrange,
            facilitate, or profit from human trafficking, sex trafficking,
            forced labor, sexual exploitation, or services involving force,
            fraud, coercion, or exploitation. Prohibited conduct includes
            controlling another person's movements, arranging exploitative
            encounters, or using a profile or message to recruit victims.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>8. Scams, deception, and financial abuse</h2>
          <p>
            Do not deceive users to obtain money, gifts, financial account
            access, personal data, or other benefits. Romance scams,
            fraudulent investment or cryptocurrency schemes, fake emergencies,
            advance-fee requests, phishing, fraudulent fundraising, and
            deceptive commercial solicitations are prohibited.
          </p>
          <p>
            Do not impersonate another person, fabricate credentials,
            manipulate users through threats, or misrepresent a financial
            opportunity to defraud users. Never demand payment in exchange
            for ending harassment or withholding private material.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>9. Harassment, hate, and unwanted contact</h2>
          <p>
            Do not engage in targeted harassment, repeated unwanted contact,
            threats, stalking, hateful abuse, or intimidation. Respect
            boundaries and requests to stop contacting someone. Do not
            publish another user's private information to expose, threaten,
            or encourage others to target them.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>10. Spam, security, and platform abuse</h2>
          <p>
            Do not send bulk unsolicited messages, operate deceptive accounts,
            scrape profiles, harvest user data, distribute malicious links,
            bypass access controls, exploit vulnerabilities, or interfere with
            the service. Do not use custom HTML or other profile features to
            execute malicious code, deceive users, or compromise security.
            Do not evade an enforcement action by creating replacement
            accounts.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>11. Reporting violations</h2>
          <p>
            Users should report suspected violations through any report,
            block, or support features available in FindAFriend. Include
            enough information to identify the relevant account or content,
            but do not redistribute illegal or intimate material as proof.
            If someone faces immediate danger, contact local emergency
            services. Suspected child exploitation may also be reported to
            the appropriate child-protection or law-enforcement authority.
          </p>
          <p>
            Do not knowingly submit false reports to harass another user.
            We may review reports, request additional information where
            appropriate, and take action based on the available evidence.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>12. Enforcement</h2>
          <p>
            When we identify or reasonably suspect a violation, we may remove
            or restrict content, disable features, issue warnings, limit
            visibility, suspend accounts, terminate accounts, or take other
            proportionate steps. Serious or urgent threats, suspected
            exploitation, trafficking, or unlawful conduct may warrant
            immediate action and referral to appropriate authorities.
          </p>
          <p>
            Enforcement decisions may take account of severity, risk,
            repetition, available evidence, and applicable law. Where
            appropriate and legally permitted, users may be given a way
            to request review of an enforcement decision.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>13. Relationship to other policies</h2>
          <p>
            This AUP supplements the FindAFriend Terms and Conditions.
            If conduct violates either policy, FindAFriend may take action
            under the applicable policy. Nothing in this AUP limits rights
            or obligations that cannot legally be waived.
          </p>
          <p>
            Read the <Link href="/terms" style={{ color: '#d93670' }}>
              Terms and Conditions
            </Link>.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>14. Policy updates</h2>
          <p>
            We may revise this AUP to address safety risks, service changes,
            or legal requirements. The effective date will be updated when
            a revised policy is published. Where required by law, we will
            provide notice or obtain consent before changes take effect.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2>15. Contact and safety concerns</h2>
          <p>
            Use the official support or reporting channel made available
            through FindAFriend to raise a concern. A dedicated, monitored
            abuse-reporting contact should be published here before launch
            if no existing reporting or support channel is available.
          </p>
        </section>

        <footer style={{
          borderTop: '1px solid #ececf1',
          marginTop: 36,
          paddingTop: 22,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <Link href="/" style={{ color: '#d93670', fontWeight: 700 }}>
            Back to FindAFriend
          </Link>
          <Link href="/terms" style={{ color: '#d93670', fontWeight: 700 }}>
            Terms and Conditions
          </Link>
        </footer>
      </article>
    </main>
  );
}