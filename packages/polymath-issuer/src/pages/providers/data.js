// @flow

export type SPStatus = {|
  title: string,
  message: string,
|};

export type SPProgress = {|
  isApplied: boolean,
  status?: SPStatus,
|};

export type ServiceProvider = {|
  id: number,
  cat: number,
  title: string,
  logo: string,
  desc: string,
  progress?: SPProgress,
  disclosure?: string,
  isToBeAnnounced?: boolean,
  isIncreasedHeight?: boolean,
|};

export type SPCategory = {|
  id: number,
  title: string,
  desc: string,
|};

export const statuses = ['Selected as Provider', 'Provider Declined', 'Other'];

export const categories: Array<SPCategory> = [
  {
    id: 0,
    title: 'Advisory',
    desc:
      'Advisory firms may help you plan and execute your STO. Your Polymath dashboard is integrated with the ' +
      'following Advisory firms. Alternatively, you can elect to use your own Advisory services.',
  },
  {
    id: 1,
    title: 'Legal',
    desc:
      'Law firms may advise you on the planning and execution of your STO. Your Polymath dashboard is integrated ' +
      'with the following Law firms. Alternatively, you can elect to use your own Law firm or General Counsel.',
  },
  {
    id: 2,
    title: 'KYC/AML',
    desc:
      'KYC is a critical component to your STO that will enable you to establish the list of approved ' +
      'transactors for your token. Alternatively, you can elect to use your own KYC firm.',
  },
  {
    id: 3,
    title: 'Marketing',
    desc:
      'Apply for Marketing/PR Agency to help drive engagement and promote your STO. ' +
      'Alternatively, you can elect to use your own Marketing/PR firm or staff.',
  },
  {
    id: 4,
    title: 'Custody Service',
    desc:
      "Apply for Custody services for the funds you raised and/or your investors' " +
      'security tokens to be held for safekeeping and minimize the risk of theft or loss. Alternatively, ' +
      'you and/or your Investors can elect to self custody funds and security tokens.',
  },
  {
    id: 5,
    title: 'Token Sale Platform',
    desc:
      'Token Sale Platforms offer end-to-end Investor on-boarding services, allowing Issuers to ' +
      'focus on their businesses rather than the technical integration details. Services typically ' +
      'include KYC/AML/Accreditation, escrow, and fund collection (crypto and/or fiat), and token distribution.',
  },
];

const providers: Array<ServiceProvider> = [
  // ADVISORY
  {
    id: 1,
    cat: 0,
    title: 'GenesisBlock',
    logo: '/providers/advisory/genesisblock.png',
    background: '/providers/advisory/bg/img-genesisblock.png',
    desc:
      'Genesis Block provides strategic business and regulatory advisory, financial services, ' +
      'and technology solutions to companies seeking to leverage blockchain technology in their core ' +
      'business and capital strategy. Our mission is to realize the disruptive potential of blockchain ' +
      'and foster its growth and adoption in every aspect of life.',
  },
  {
    id: 3,
    cat: 0,
    title: 'Pegasus',
    logo: '/providers/advisory/pegasus.png',
    background: '/providers/advisory/bg/img-pegasus.png',
    desc:
      'The Pegasus Accelerator Program provides Blockchain and Token consulting and support services. ' +
      'Token offerings are compliant with jurisdictional regulations through the PIBCO process.',
  },
  {
    id: 17,
    cat: 0,
    title: 'Tokenizo',
    logo: '/providers/advisory/tokenizo.png',
    background: '/providers/advisory/bg/img-tokenizo.png',
    desc:
      'We are an end-to-end service for the tokenization of assets using blockchain, focused on the ' +
      'Latin American and Southern Europe markets.\nTokenizo is an Investment Bank 2.0. We combine ' +
      'in-country affiliates with world class technology partners. This new way of Banking will preserve the high ' +
      'standards of personalized service with the added benefit of  technology in a way that has never ' +
      'been done before:\n- We will continually develop a technology ecosystem and partner with best of ' +
      'class service providers that will allow to meet regulatory requirements to issue securities by using ' +
      'a tokenized asset, traded in a token exchange.\n- Our Local affiliates will provide in-country service ' +
      'and communications while our Corporate team focuses on the interaction with our technology ecosystem.',
  },
  {
    id: 23,
    cat: 0,
    title: 'Chain Partners',
    logo: '/providers/advisory/chain-par.png',
    background: '/providers/advisory/bg/chain-par.png',
    desc:
      'Chain Partners is a blockchain company builder based in Seoul, Korea. We are a group of technologists, ' +
      'entrepreneurs, and engineers, building the infrastructure for a decentralized future.',
  },
  {
    id: 31,
    cat: 0,
    title: 'QRC',
    logo: '/providers/advisory/qrc.png',
    background: '/providers/advisory/bg/img-qrc.png',
    desc:
      'QRC is a Regtech consultancy based in Hong kong for the blockchain industry providing end-to-end ' +
      'solutions for security token offerings and security token trading with a focus on Asia and South East ' +
      'Asia region. QRC is a recognised thought leader in regtech working on international standards for security ' +
      'tokens and partnering with academia including Taiwan Tech and the University of Malaya on regtech and the ' +
      're-structuring of capital markets using blockchain. QRC has connections to local lawyers, corporate ' +
      'finance agencies and broker distribution channels in the region. ',
  },
  {
    id: 32,
    cat: 0,
    title: 'Athena Blockchain',
    logo: '/providers/advisory/athena.png',
    background: '/providers/advisory/bg/img-athena.png',
    desc:
      'With offices in Chicago, New York, Santa Monica, and Miami, Athena Blockchain provides advisory services ' +
      'to issuers, sponsors, and promoters of tokenized securities by leveraging legal, compliance, technical, ' +
      'and financial experience to structure offerings and provide an understanding of capital markets.',
  },
  {
    id: 33,
    cat: 0,
    title: 'Digichain Capital',
    logo: '/providers/advisory/digichaincapital.png',
    background: '/providers/advisory/bg/img-digichaincapital.png',
    desc:
      'Blockchain Industry Services:\n - Complete consultation services from idea to implementation, including but ' +
      'not limited to: regulatory and legal issues;Tax and jurisdiction;Company structure and roadmap requirements;' +
      '\nToken economics including investor and user confidence;Documentation and business model,Fundraising models;' +
      '\nInstitutional level tech dev;Critical mass of users and monetization;Marketing and exposure;' +
      'Secondary market and liquidity solutions;(Consultation and/or active assistance)' +
      '\nSecondary Market Solutions:\n - Tailored for projects and exchanges including exchange listings and liquidity ' +
      'management, also applicable for STOs.\nRegulated STO:\n - Launching fully regulated STOs and tokenized securities' +
      'under the Australian and German governments. \nProfessional Token Economics:\n - Sophisticated, progressive and viable ' +
      'token models tailored to suit, including dual token and convertible share options.',
  },
  {
    id: 34,
    cat: 0,
    title: 'Sino Global Capital',
    logo: '/providers/advisory/sinoglobalcapital.png',
    background: '/providers/advisory/bg/img-sinoglobalcapital.png',
    desc:
      '- Strategic Investment - Opportunistic but with a focus on digital asset infrastructure.' +
      '\n- Strategic Consulting - Provide insights to focus and optimize business strategy in the Greater China region.' +
      '\n- Financial Advisory - Introductions to our curated capital network of sophisticated investors.' +
      '\n- Structuring - Design of digital assets including tokenomics.' +
      '\n- Business development -  Find partners who see value in emerging tech to improve their businesses.' +
      '\n- Valuation -  Provide independent valuation for underlying asset. ',
  },
  {
    id: 39,
    cat: 0,
    title: 'DLA Piper',
    logo: '/providers/advisory/dlapiper.png',
    background: '/providers/advisory/bg/img-dlapiper.png',
    desc:
      'DLA Piper is a pioneer in serving technology clients and companies that use technology, having established a ' +
      'presence in the heart of Silicon Valley over 50 years ago. Today, we have offices in over 40 countries throughout ' +
      'the world – positioning us to assist companies with their legal needs wherever they are and wherever they would like to go.' +
      '\nThrough our Blockchain and Digital Assets Practice Group, our team offers strategic advice on a global basis to address ' +
      'the needs of companies implementing blockchain technology solutions and creating and deploying digital assets. We combine ' +
      'a global network of attorneys with a wide range of relevant practices (including securities, IP protection and licensing, ' +
      'commodities future trading regulations, privacy and money transmitter rules) to help companies take advantage of these new ' +
      'opportunities and attain their strategic goals through the use of blockchain.\nWe assist companies at every stage of their ' +
      'life cycle, from early-stage startups raising funds to build new blockchain technologies to Fortune 100 companies ' +
      'implementing blockchain-based solutions. For more information, please email us Scott Thiel at Scott.Thiel@dlapiper.com',
  },

  // LEGAL
  {
    id: 5,
    cat: 1,
    title: 'Lexcuity PC',
    logo: '/providers/legal/lexcuity.png',
    background: '/providers/legal/bg/img-lexcuity.png',
    desc:
      'Lexcuity PC is a securities and corporate law firm with deep experience in exempt as well as ' +
      'SEC-registered alternative finance offerings, having advised on hundreds of private offerings  ' +
      'that have raised billions of dollars for developers and entrepreneurs over the past decade. ' +
      'As a leader and pioneer in investment crowdfunding, Lexcuity serves the emerging blockchain ' +
      'and cryptocurrency industries in structuring and documenting security token offerings (STOs), ' +
      'initial coin offerings (ICOs) and other capital-raising initiatives. Never satisfied with ' +
      'rote “compliance documents,” Lexcuity prides itself on helping clients effectively tell ' +
      'their stories to investors while satisfying all regulatory compliance requirements. ' +
      'We also contribute our insights to the blockchain community to help build the industry’s ' +
      'best practices.',
  },
  {
    id: 18,
    cat: 1,
    title: 'Security Token Lawyers',
    logo: '/providers/legal/STL.png',
    background: '/providers/legal/bg/img-stlawyers.png',
    desc:
      'Security Token Lawyers is a partnership between US and Israeli legal experts.  We advise security ' +
      'token issuers, exchanges and investors, bringing extensive securities and funds experience in the US and ' +
      'Israel, a deep understanding of the technology and creativity and innovation to build a new type of ' +
      'asset class in a new mark. Our counseling includes various regulatory matters, including compliance ' +
      'with securities, privacy and AML/KYC. We are deeply connected within the international security token ' +
      'ecosystem, including issuance platforms, exchanges, service providers and beyond.  This allows us to ' +
      'help our clients through the entire process of a security token offering, from initial structuring ' +
      'through issuance and closing and then beyond to exchange listing and trading. We are also very involved ' +
      'Tel Aviv, Israel, with our New York office set to open in September 2018.',
  },
  {
    id: 19,
    cat: 1,
    title: 'Aird & Berlis',
    logo: '/providers/legal/aird-berlis.png',
    background: '/providers/legal/bg/img-airdberlis.png',
    desc:
      'Aird & Berlis provides strategic legal and business advice in all principal areas of corporate and ' +
      'commercial law, including Canadian capital markets activities. Members of the Aird & Berlis Capital Markets ' +
      'Group regularly provide Canadian securities law advice to all participants in the Canadian capital markets, ' +
      'including foreign and domestic issuers, dealers and investors. We have advised these capital markets ' +
      'participants on Canadian law matters affecting coin, token and other types of offerings.',
  },
  {
    id: 20,
    cat: 1,
    title: 'Cassels Brock Lawyers',
    logo: '/providers/legal/cassels-2.png',
    background: '/providers/legal/bg/img-blackwell.png',
    desc:
      'Cassels Brock & Blackwell LLP is a Canadian law firm focused on serving the transaction, advocacy and ' +
      'advisory needs of the country’s most dynamic business sectors. Our Emerging Companies Group draws on the ' +
      'expertise of partners across key areas of the firm including private equity, restructuring, tax, IP and M&A. ' +
      'Each team member also offers an in-depth understanding of the technology sector and this enables our team to ' +
      'not only provide high quality legal advice, but also act as a trusted business advisor. Our lawyers have a deep ' +
      'understanding of the regulatory landscape and the legal implications and requirements for use of cryptocurrency ' +
      'and blockchain, including securities, fintech, white-collar crime, tax and financial regulation issues. Whether ' +
      'your company is public or private, a start-up or a mature company, big or small, looking for venture capital, ' +
      'equity financing, debt financing or something more esoteric, our lawyers can help.',
  },
  {
    id: 21,
    cat: 1,
    title: 'Messner Reeves LLP',
    logo: '/providers/legal/messner.png',
    background: '/providers/legal/bg/img-messner.png',
    desc:
      'Messner Reeves is a national full-service business law with expertise in securities matters in the following ' +
      'jurisdictions: Colorado, Nebraska, Pennsylvania.',
  },
  {
    id: 23,
    cat: 1,
    title: 'Petros Law Group',
    logo: '/providers/legal/petros.png',
    background: '/providers/legal/bg/img-petros.png',
    desc:
      'Petros Law Group is a fintech law firm that focuses on commercial business application of digital asset ' +
      'technologies through blockchain infrastructures, such as tokenized-securities. The Firm focuses on bringing ' +
      'blockchain to commercial real estate and corporate business transactions',
  },
  {
    id: 26,
    cat: 1,
    title: 'Vistra Corporate Law',
    logo: '/providers/legal/vistra.png',
    background: '/providers/legal/bg/img-vistra.png',
    desc:
      'Vistra Corporate Law is an authorized and regulated law firm in England that helps businesses and ' +
      'organizations to thrive by providing trusted, integrated legal services. Part of Vistra, a ' +
      'multi-disciplined, multi-jurisdictional corporate service provider. So whatever challenges or ' +
      'opportunities you’re presented with, you can be sure you’ve got the right people beside you ' +
      'providing the very best insight, advice, and expertise. We are experts in advising fast-growth ' +
      'tech and blockchain companies, including in connection with security token offerings. Wherever in ' +
      'the world, you’re based, our expertise will help you to operate efficiently, decisively and effectively. ' +
      'Turn to us for support with Corporate, Employment or Commercial law as well as Corporate Governance, ' +
      'whether under English law or on multijurisdictional advice projects.',
  },
  {
    id: 29,
    cat: 1,
    title: 'Hassans International Law Firm',
    logo: '/providers/legal/hassans.png',
    background: '/providers/legal/bg/img-hassans.png',
    desc:
      'Hassans International Law Firm is the largest and leading law firm in Gibraltar, offering a broad range ' +
      'of legal services to clients both in Gibraltar and internationally. Consistently ranked as the leading law ' +
      'firm in Gibraltar by Chambers &amp; Partners and by Legal 500, Hassans is an award-winning, market-leading ' +
      'legal practice that focuses on the best-in-class client service delivery that provides expert commercial and ' +
      'pragmatic advice and solutions to clients. \n\nEstablished in 1939 by Sir Joshua Hassan, the firm has grown in ' +
      'size and standing to become one of the world’s leading full service law firms, comprising the largest number ' +
      'of top-ranked legal experts in Gibraltar across all legal practice areas. \n\nOur team of Gibraltar lawyers possess ' +
      'a wide range of legal expertise, including corporate &amp; commercial law, M & A, litigation, property law, ' +
      'maritime law and ship registration, funds, trust management, tax law and FinTech. Hassans also has access to ' +
      'an extensive network of global, tier- one professional advisors and intermediaries across many jurisdictions. ' +
      '\n\nHassans has continually led the way in contributing to, and is credited with, the development and growth of ' +
      'Gibraltar’s Financial Services, Funds, Insurance, Online Gaming, and Private Client sectors. The firm is ' +
      'regularly instructed by HM Government of Gibraltar to assist with the drafting of key legislative enactments, ' +
      'and we engage with Regulatory authorities to develop legal and regulatory frameworks in Gibraltar and assist ' +
      'with the same internationally. Most recently, the Fintech team at Hassans has been involved in the development ' +
      'of the Distributed Ledger Technology sector in Gibraltar, as well as assisting with the development of the Token ' +
      'Sale regulatory framework. Possessing in-depth legal and technical expertise in Distributed Ledger Technology ' +
      '(including blockchain), the Firm has attracted key players in the DLT industry to Gibraltar who have made ' +
      'Gibraltar their home for their wide range of DLT-based businesses.',
  },
  {
    id: 37,
    cat: 1,
    title: 'L&Y Law',
    logo: '/providers/legal/lylawoffice.png',
    background: '/providers/legal/bg/img-lylawoffice.png',
    desc:
      'We are a full-service law firm, which offers a full range of legal services for both individuals and businesses, ' +
      'ranging from Merger & Acquisitions (private and public), Corporate, Capital Markets (ECM & DCM), Banking & Finance, ' +
      'Initial Coin Offering (ICO), Security Token Offering (STO), Cryptocurrency/Blockchain, Licensing, Smart Contracts, ' +
      'Tech Startups, Fund Formation, Intellectual Properties, Dispute Resolution/Arbitration, SFC Investigation, Data ' +
      'Protection, Privacy & Security, Competition Matters, General Commercial Matters, Escrow Services and Company ' +
      'Secretarial Services.',
  },

  // KYC/AML
  {
    id: 11,
    cat: 2,
    title: 'Katipult',
    logo: '/providers/kyc/katipult.png',
    background: '/providers/kyc/bg/img-katipult.png',
    desc:
      'At Katipult, we come to work each day because we want to solve some of the biggest pain points for our ' +
      "clients working in the private capital markets. Most firms aren't capitalizing on opportunities in today's " +
      'markets because they are still using manual systems, ad hoc processes, and experiencing bottlenecks because ' +
      'of key person dependencies. The majority of companies are still using Excel, email, paper-based processes ' +
      'and phone calls to manage payments, signatures, client communication, and more.\n Our mission at Katipult is ' +
      'to automate all the tedious administrative tasks, ensure that all of the workflows are inherently compliant, ' +
      'and help our clients increase profitability and versatility through fully automated, integrated, centralized, ' +
      'and easy to use software.\n You deserve a solution that allows your firm to be ahead of the competition. ' +
      'We are here to help you!',
  },
  {
    id: 22,
    cat: 2,
    title: 'Glyph',
    logo: '/providers/kyc/glyph.png',
    background: '/providers/kyc/bg/img-glyph.png',
    desc:
      'Glyph is a unique identity platform that enables users to own their own KYC and other identity assets such as ' +
      'accredited investor status, and share them via a simple Oauth 2.0 model and accompanying app. (Imagine log in ' +
      'with Facebook, that also provides custom authentication data at the point of use). This enables verifying ' +
      'partners to collect any kind of identity information seamlessly, in 60 seconds or less, and receive that ' +
      'information in a number of formats. Glyph has been described as the most customizable and beautiful KYC check ' +
      'available. ',
  },
  {
    id: 24,
    cat: 2,
    title: 'Netki',
    logo: '/providers/kyc/netki.png',
    background: '/providers/kyc/bg/img-netki.png',
    desc:
      "Netki provides bank-grade KYC/AML on-boarding from your customer's phone in under a minute. By leveraging " +
      'machine-learning and computer vision tools, Netki is able to automate customer verification with a fully ' +
      'customizable platform that is configurable to meet any compliance requirements. With KYC, AML, Accredited ' +
      'Investor verification and corporate on-boarding tools, Netki can help you streamline your compliance ' +
      'program while preventing fraud and balancing end-user experience',
  },
  {
    id: 25,
    cat: 2,
    title: 'IdentityMind Global',
    logo: '/providers/kyc/identitymind.png',
    background: '/providers/kyc/bg/img-identitymind.png',
    desc:
      'All the regulatory services you need including KYC, Transaction Monitoring, and Accredited Investor ' +
      'Validation. In addition, only IdentityMind provides you with an integrated blockchain explorer to ' +
      'alert you of the risk of incoming digital currency. IdentityMind Global has helped over 200 ICOs/STOs ' +
      'from all over the world automate their compliance',
  },
  {
    id: 28,
    cat: 2,
    title: 'Republic.co',
    logo: '/providers/kyc/republic.png',
    background: '/providers/kyc/bg/img-republic.png',
    desc:
      'Republic’s end-to-end compliance solution is a streamlined automated platform that ensures an efficient ' +
      'online investor / participant verification and accreditation process at a highly competitive price. ' +
      'KYC-AML due diligence services include:' +
      '\n-Instant verification of (most) investors / participants:' +
      '\n   -Verify scanned passport / license / identity and match to claimed identity' +
      '\n   -Verify collected information against existing public records' +
      '\n   -Verify provided information (i.e. EIN and ID numbers) and check good standing, and' +
      '\n   -Review residence addresses, billing addresses, IP addresses' +
      '\n-Check investors / participants against multiple government and financial industry AML watch-lists, ' +
      'including, but not limited to, the United States’ Office of Foreign Assets Control (OFAC).Beneficial ' +
      'ownership checks for domestic and international investors.' +
      '\n-Live KYC-AML due diligence verification results dashboard' +
      '\nSEC compliant Reg D investor accreditation services include:' +
      '\n-Meets requirements of SEC Rule 501 of Reg D through the four “reasonable steps to verify” standards ' +
      'including: 1) net income; 2) net wealth; 3) third party; or 4) pre-existing accredited investor verification' +
      '\n-Reviewed by a team of licensed attorneys and/or CPAs' +
      '\n-Live investor accreditation results dashboard' +
      '\n\nOnce the questionnaire has been completed and evidence of accreditation provided, investors / participants’' +
      'applications that are then authorized will be able to proceed to complete an investment / participation.' +
      '\n\nRepublic will provide the Client with a single report to verify all investor accreditation or qualified ' +
      'purchaser status, to ensure SEC standards are met.' +
      '\n\nDocuments uploaded as evidence of KYC and accreditation are kept private and are only used to assess ' +
      'investor / participant status.' +
      '\n\nDeliverable to the Client: Republic will provide the Client with access to a live dashboard confirming ' +
      'KYC-AML-Accreditation performed on each investor / participant including their status. Republic will also ' +
      'send the Client a report including the status of all investors / participants during that preceding calendar ' +
      'month. Republic will not provide any Personal Identifying Information (“PII”) not otherwise provided to the ' +
      'Client through the Client’s on-boarding process.',
  },
  {
    id: 30,
    cat: 2,
    title: 'EarlyIQ',
    logo: '/providers/kyc/earlyiq.png',
    background: '/providers/kyc/bg/img-earlyiq.png',
    desc:
      'EarlyIQ is an industry-leading provider of Accredited Investor Verifications and issuer "Bad Actor" Background Checks.' +
      '\nEarlyIQ Accredited Investor Verifications are simple, safe, and secure. Confidently comply with SEC Reg D 506(c) ' +
      'reasonable steps. Includes Identity Verification and OFAC (Watchlist) check.' +
      '\nEarlyIQ "Bad Actor" Background Reports eliminate complexity and deliver unprecedented visibility into the ' +
      'background details of your target investment company. Through our proprietary process, we triangulate information from ' +
      'public record, online, offline and self-reported information to give stakeholders actionable insight into both the ' +
      'target organization and the team behind it. ' +
      '\nOur solutions can be fully integrated with partner sites for seamless user ' +
      'experience and can be customized to provide deeper levels of information beyond basic compliance requirements to ' +
      'facilitate vetting and curating deal flow by the partners.',
  },
  {
    id: 35,
    cat: 2,
    title: 'Sum & Substance',
    logo: '/providers/kyc/sumsub.png',
    background: '/providers/kyc/bg/img-sumsub.png',
    desc:
      'Sumsub is one answer to all onboarding and compliance challenges.\n\nSumsub AI-based solution automates identity ' +
      'verification and antifraud, as well as provides bank-grade KYC (including STOs), KYB, KYT compliance, AML screening, ' +
      'customer data storage to protect and enable regulated businesses online. 97% hit rate and strong legal expertise put ' +
      'Sumsub among the leading players of the market. The company was founded in 2015 with the headquarter in London, ' +
      'United Kingdom. \n\nThe company was incorporated in 2015 and is headquartered in London, United Kingdom.',
  },
  {
    id: 36,
    cat: 2,
    title: 'KABN',
    logo: '/providers/kyc/kabn.png',
    background: '/providers/kyc/bg/img-kabn.png',
    desc:
      'The KABN Network is an integrated suite of services that features KABN ID. This is KABN’s patent-pending, GDPR compliant, ' +
      'Blockchain and biometrically-based, “Always On” KYC / AML validation and verification process. KABN ID supports Polymath ' +
      'issuers to validate and verify identity and support investor qualification review.',
  },

  // MARKETING
  {
    id: 13,
    cat: 3,
    title: 'Wachsman PR',
    logo: '/providers/marketing/wachsmanpr.png',
    background: '/providers/marketing/bg/img-wachsman.png',
    desc:
      'Wachsman provides media relations, strategic communications, brand development, and corporate advisory ' +
      'services to many of the most indispensable companies in the financial technology, digital currency, and ' +
      'crypto-asset sectors.',
  },
  {
    id: 27,
    cat: 3,
    title: 'Ideas By Nature',
    logo: '/providers/marketing/ideasbynature.png',
    background: '/providers/marketing/bg/img-ideasbynature.png',
    desc:
      'Ideas By Nature is the leading design and product development agency, focused entirely on blockchain ' +
      'technology. Founded in 2011, Ideas By Nature has launched some of the most successful blockchain technology ' +
      'and cryptocurrency products, user experiences, and brands. Our teams are well-crafted with elite designers, ' +
      'engineers, leadership, and blockchain technology expertise.\n\nHaving the most experience working alongside ' +
      'blockchain-based businesses and innovators, we understand this industry better than any agency. This focus ' +
      'allows us to consistently develop the most intuitive user experiences and useful products. Here’s what we ' +
      'do: \n -Branding & Visual Identity Design\n-Proof-of-Concept Product Design\n-Rapid Prototype Development ' +
      '\n-MVP Application Build & Launch\n-Website & Marketing Collateral Design\n-User Experience & Interactive ' +
      'Design\n-Mobile-First Blockchain Application Development\n\n“We build world class user-centered products ' +
      'that leverage blockchain technology. Everyday.”',
  },

  // CUSTODY SERVICE
  {
    id: 15,
    cat: 4,
    title: 'BitGo',
    logo: '/providers/custody/bitgo.png',
    background: '/providers/custody/bg/img-bitgo.png',
    desc:
      'BitGo is a blockchain software company that secures digital currency for institutional investors. Its ' +
      'technology solves the most difficult security, compliance and custodial problems ' +
      'associated with blockchain-based currencies, enabling the integration of digital currency into the global ' +
      "financial system. BitGo's customers, which include the world's largest cryptocurrency exchanges and " +
      "financial institutions, conduct more than $10 billion in transactions monthly. BitGo's global headquarters " +
      'is located in Palo Alto, California with offices in New York, London, Tokyo and Singapore.',
  },
  {
    id: 16,
    cat: 4,
    title: 'Prime Trust',
    logo: '/providers/custody/primetrust.png',
    background: '/providers/custody/bg/img-primetrust.png',
    desc:
      'Prime Trust is chartered, insured financial institution that as a "Qualified Custodian" provides ' +
      'token and FIAT custody, funds processing, AML/KYC compliance, and transaction technology for the new ' +
      'digital economy. As a blockchain-based trust company our mission is to provide ICO and SCO issuers with ' +
      'the best-in-class solutions to frictionlessly meet the needs of their offerings and of exchanges ' +
      'and secondary markets.',
  },
  {
    id: 38,
    cat: 4,
    title: 'Onchain',
    logo: '/providers/custody/onchain.png',
    background: '/providers/custody/bg/img-onchain.png',
    desc:
      'Headquartered in Singapore, Onchain Custodian (ONC) offers a global, standardised, resilient and compliant ' +
      'custody service for the safekeeping of institutional digital asset investments with incomparable user ' +
      "experience. ONC's solution is built with flexibility to meet the possible futures of crypto custody.",
  },

  // TOKEN SALE PLATFORMS
  {
    id: 40,
    cat: 5,
    title: 'CrowdEngine',
    logo: '/providers/tokensale/crowdengine.png',
    background: '/providers/tokensale/bg/img-crowdengine.png',
    desc:
      'CrowdEngine (https://www.crowdengine.com) provides white-label solutions that enables issuers to sell security ' +
      'tokens online in a matter of weeks.  CrowdEngine supports all offering types including Reg. D, Reg. S, Reg. A+, ' +
      'and Reg. CF, as well as cryptocurrency payments & escrow, KYC/AML, and investor accreditation.  CrowdEngine ' +
      'increases speed to market and compliance while reducing startup costs.',
  },
  {
    id: 41,
    cat: 5,
    title: 'SeriesOne',
    logo: '/providers/tokensale/seriesone.png',
    background: '/providers/tokensale/bg/img-seriesone.png',
    desc:
      'SeriesOne is a financial technology company designed to liberate corporate finance from the big banks and corporate ' +
      'elites that have historically dominated the space. What this means for businesses and entrepreneurs is access to ' +
      'capital they’ve never had before. It means giving investors access to investment opportunities, particularly in ' +
      'innovative private companies, that they’ve never had before. And it means expanding financing and transaction ' +
      'options for both. seriesOne enables businesses and entrepreneurs to raise money through digital securities which ' +
      'are issued on a blockchain, as well as through traditional equity and debt securities. seriesOne also allows ' +
      'investors to transfer funds in the way that works best for them: via cryptocurrencies as well as ACH or wire transfers. ' +
      'All of this is financing unchained—a new world of freedom and opportunity for businesses, entrepreneurs, and investors. ' +
      'This is seriesOne.',
  },
];

export const getProviders = () => {
  providers.sort((a: ServiceProvider, b: ServiceProvider) => {
    const textA = a.title.toUpperCase();
    const textB = b.title.toUpperCase();
    if (a.isToBeAnnounced && b.isToBeAnnounced) {
      return 0;
    } else if (a.isToBeAnnounced) {
      return 1;
    } else if (b.isToBeAnnounced) {
      return -1;
    }
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  return providers;
};

export const getProgress = (ticker: string): Array<SPProgress> => {
  return JSON.parse(String(localStorage.getItem('providers-' + ticker))) || [];
};

export const saveProgress = (ticker: string, progress: Array<SPProgress>) => {
  localStorage.setItem('providers-' + ticker, JSON.stringify(progress));
};

export const isProvidersPassed = (providers: ?Array<ServiceProvider>) => {
  let isProvidersPassed = true;
  if (providers) {
    for (let p: ServiceProvider of providers) {
      if (p.cat === 0) {
        // only cat 0 is obligatory
        if (p.progress && p.progress.isApplied) {
          isProvidersPassed = true;
          break;
        }
        if (!p.progress) {
          isProvidersPassed = false;
        }
      }
    }
  } else {
    isProvidersPassed = false;
  }
  return isProvidersPassed;
};
