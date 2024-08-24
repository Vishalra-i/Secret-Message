import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';
import { VerificationEmailProps } from './verificationEmail';

export default function PasswordResetEmail({ username, verifyCode }: VerificationEmailProps) {
  return (
    <Html>
      <Head>
        <Font fontFamily="Arial" fallbackFontFamily="Verdana" />
      </Head>
      <Preview>Password Reset Verification Code</Preview>
      <Section style={{ backgroundColor: '#ffffff', padding: '20px' }}>
        <Row>
          <Heading style={{ fontSize: '24px', fontWeight: 'bold', color: '#000000' }}>
            Hello {username},
          </Heading>
        </Row>
        <Row>
          <Text style={{ color: '#000000' }}>
            Your verification code is:
          </Text>
        </Row>
        <Row>
          <Text style={{ color: '#000000', fontWeight: 'bold', fontSize: '24px' }}>
            {verifyCode}
          </Text>
        </Row>
        <Row>
          <Text style={{ color: '#000000' }}>
            Please enter this code to verify your account.
          </Text>
        </Row>
        <Row>
          <Button
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/reset/${username}`}
            style={{
              backgroundColor: '#1E90FF',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '5px',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Verify here
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
