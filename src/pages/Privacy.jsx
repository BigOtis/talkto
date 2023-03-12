import Header from '../components/Header'
import Meta from '../components/Meta'
import React from 'react';

const Privacy = () => {
  // page content
  const pageTitle = 'Terms of Service'
  const pageDescription = 'OtisFuse Terms of Service and Privacy Policy'
  const aboutText = `Privacy Consent Policy for Otisfuse.com Google OAuth Page

  Otisfuse.com ("we," "us," or "our") provides a Google OAuth page on our website for users to log in and use certain features of our service. We understand that your privacy is important, and we want you to be aware of the information we collect, how we use it, and your choices regarding your data. This Privacy Consent Policy describes our practices regarding the collection, use, and disclosure of personal information when you use our Google OAuth page on otisfuse.com.
  
  What Information We Collect:
  
  When you use our Google OAuth page, we collect your email address from your Google account to keep track of the number of essays you can write. We do not collect any other personal information from you.
  
  How We Use Your Information:
  
  We use your email address to keep track of the number of essays you can write on our platform. We do not share your email address with any third parties.
  
  Cookies:
  
  We use cookies on our website to track user activity and improve our service. We do not use cookies to collect any personally identifiable information.
  
  Your Choices:
  
  You can choose not to provide us with your email address when you log in through Google OAuth. However, this will prevent you from using certain features of our service.
  
  Data Retention:
  
  We will retain your email address for as long as you have an account with us. If you choose to delete your account, we will delete your email address from our database.
  
  Security:
  
  We take reasonable measures to protect your personal information from unauthorized access, use, and disclosure. However, please be aware that no security measures are completely foolproof.
  
  Changes to this Privacy Policy:
  
  We may update this Privacy Consent Policy from time to time. If we make any material changes, we will notify you by posting the updated policy on our website or by sending you an email.
  
  Contact Us:
  
  If you have any questions or concerns about our Privacy Consent Policy or our practices, please contact us at otis1017@gmail.com.
  
  By using our Google OAuth page, you consent to the collection, use, and disclosure of your personal information as described in this Privacy Consent Policy.`
  const termsOfService = `Terms of Service for Otisfuse.com

  Welcome to Otisfuse.com ("we," "us," or "our"). These Terms of Service ("Terms") govern your use of our website and services. By using our website and services, you agree to these Terms. If you do not agree to these Terms, please do not use our website or services.
  
  Use of our Website and Services:
  
  You may use our website and services only for lawful purposes and in accordance with these Terms. You agree not to use our website or services:
  
      In any way that violates any applicable federal, state, local, or international law or regulation.
      To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.
      To impersonate or attempt to impersonate us, our employees, another user, or any other person or entity.
      To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of our website or services, or which, as determined by us, may harm us or users of our website or services, or expose them to liability.
  
  Intellectual Property:
  
  Our website and services and their entire contents, features, and functionality are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property or proprietary rights laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website or services without our prior written consent.
  
  Disclaimer of Warranties:
  
  Our website and services are provided "as is," without warranty of any kind, either express or implied, including without limitation any warranty for information, services, uninterrupted access, or products provided through or in connection with our website or services, including without limitation the software licensed to us and the results obtained through our website or services. Specifically, we disclaim any and all warranties, including without limitation: 1) Any warranties concerning the availability, accuracy, usefulness, or content of information, products or services; and 2) Any warranties of title, warranty of non-infringement, warranties of merchantability or fitness for a particular purpose.
  
  Limitation of Liability:
  
  In no event shall we be liable to you or any third-party for any indirect, consequential, exemplary, incidental, special or punitive damages, including lost profits damages arising from your use of our website or services, even if we have been advised of the possibility of such damages.
  
  Indemnification:
  
  You agree to indemnify, defend and hold harmless us and our affiliates, and their respective officers, directors, employees, agents, licensors, and suppliers from and against any claims, actions, demands, damages, liabilities, and settlements, including without limitation, reasonable legal and accounting fees, arising out of or resulting from your use of our website or services, or your violation of these Terms.
  
  Changes to these Terms:
  
  We reserve the right to change or modify these Terms at any time and in our sole discretion. We will notify you of any changes by posting the updated Terms on our website. Your continued use of our website or services following the posting of the revised Terms means that you accept and agree to the changes.
  
  Termination:
  
  We may terminate your access to our website or services at any time, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account.`

  return (
    <div>
      <Meta title={pageTitle}/>
      <Header head={pageTitle} description={pageDescription} />
      <hr />
        {aboutText.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
      <hr />
      {termsOfService.split('\n').map((line, index) => (
          <React.Fragment key={index}>
            {line}
            <br />
          </React.Fragment>
        ))}
        <p>
          <a href="https://beta.openai.com/docs/usage-policies">
            See the following disclaimer and usage from OpenAI.
          </a>
        </p>
      <div className='starter-template text-center mt-5'>
        <p className='lead text-capitalize'>
          <a href="https://store.steampowered.com/search/?publisher=Otis%20Fuse%20Productions">
            Created by Otis Fuse Productions
          </a>
        </p>
      </div>
    </div>
  )
}

export default Privacy