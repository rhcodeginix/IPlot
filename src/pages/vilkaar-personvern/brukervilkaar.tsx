"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";

const Brukervilkaar = () => {
  return (
    <>
      <div className="bg-lightBlue py-2 md:py-4">
        <SideSpaceContainer>
          <div className="flex items-center flex-wrap gap-1 mb-4 md:mb-6">
            <Link
              href={"/"}
              className="text-primary text-xs md:text-sm font-medium"
            >
              Hjem
            </Link>
            <Image src={Ic_breadcrumb_arrow} alt="arrow" />
            <span className="text-secondary2 text-xs md:text-sm">
              Brukervilkaar
            </span>
          </div>
          <h3 className="text-black font-semibold text-lg md:text-2xl desktop:text-[30px]">
            Brukervilkaar
          </h3>
        </SideSpaceContainer>
      </div>
      <div className="pt-8 pb-32">
        <SideSpaceContainer>
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h1 className="text-black font-bold text-lg md:text-xl desktop:text-2xl">
                Brukervilkår for MinTomt.no
              </h1>
              <p className="font-semibold text-xs md:text-sm desktop:text-base">
                03. mai. 2025
              </p>
            </div>
            <p className="text-secondary text-sm md:text-base desktop:text-lg mb-3">
              Brukervilkårene beskriver hvilke bestemmelser som legges til grunn
              når du bruker mintomt.no
            </p>

            <h6 className="text-base font-semibold desktop:text-xl">
              Brukervilkår
            </h6>

            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                1. Beskrivelse, formål, partene
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Disse brukervilkårene (heretter “Brukervilkårene”) gjelder for
                tjenestene mintomt.no og våre underdomener inkl. evt.
                tilknyttede mobilapplikasjoner (heretter “Tjenestene”), og iPlot
                AS (org. nr. 834 632 772) som leverandør av Tjenestene (heretter
                “MT”).
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Disse Brukervilkår gjelder for privatpersoner som oppretter en
                brukerprofil eller logger inn på eksisterende brukerprofil i
                Tjenestene (heretter «Bruker»).
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Merk at iPlot AS ifm sitt bedriftsområde på mintomt.no har egne
                brukervilkår for bedrifter. MinTomt sine brukervilkår for
                bedrifter kan.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                iPlot AS er et teknologiselskap majoritetseid av Fenger Holding
                AS, org. nr. 923 769 854 og Simen S. Wolmer.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene gir Bruker innsikt i boligmarkedet og sin bolig
                gjennom å blant annet la Bruker se informasjon om tomter og
                boliger, reguleringsbestemmelser, estimert markedsverdi,
                statistikker over boligmarkedet, boligers transaksjonshistorikk
                mm. For egen bolig(er) har Bruker tilgang til ytterligere
                tjenester spesifikt for sin bolig(er). Bruker kan via Tjenestene
                også få tilgang til tjenester levert fra eksterne partnere.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Ved å opprette en bruker eller logge inn en eksisterende bruker
                i Tjenestene ansees de gjeldende Brukervilkårene som akseptert.
                Ved å akseptere Brukervilkårene samtykker Bruker til at MT kan
                behandle Brukers personopplysninger. Bruker samtykker også til å
                bruke Tjenestene for rent personlige eller andre private formål.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                2. Tilgang til og bruk av Tjenestene
              </h4>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.1 Tilgang til Tjenestene
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Denne avtalen gir deg rett til å benytte Tjenestene, slik de
                  til enhver tid tilbys, jf. pkt. 9. MT kan videreutvikle
                  Tjenestene med nye funksjoner og muligheter, men MT har også
                  rett til fjerne eller endre eksisterende funksjoner.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.2 Beskrivelse av Tjenestene
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.2.1 Beskrivelse av MINTOMT.no
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Tjenesten mintomt.no en applikasjon hvor Bruker kan se
                    bolig-relevant informasjon om sin og andres tomt/bolig, dens
                    reguleringsbestemmelser og utvalgte samarbeidspartnere av
                    ferdighus- og hytter. Funksjonene i Tjenesten baserer seg på
                    aktivitet i markedet og enkelt tomters verdi og egenskaper.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.2.2 Beskrivelse av MINTOMT.no (for privatperson)
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Tjenesten mintomt.no (for privatperson) gir hjemmelshaver
                    til fast eiendom adgang til å se informasjon om sin
                    tomt(er). Tjenesten er knyttet til eiendommer registrert i
                    Norges offisielle eiendomsregister («Matrikkelen»).
                  </p>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Offentlige meldinger, dokumentasjon og andre data som
                    knyttes til en spesifikk eiendom, vil følge eiendommen i
                    eiendommens levetid.
                  </p>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Funksjonene i Tjenesten mintomt.no baserer seg på boligens
                    og tomtens egenskaper. Dette innbefatter blant annet
                    informasjon fra grunnboken, egenskaper og dokumentasjon
                    tilknyttet sin bolig/tomt, og se hvilke ferdighusprodusenter
                    som kan potensielt levere bolig/hytte til Bruker.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.3 Betaling og avbestilling
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  For privatpersoner tilbyr Tjenestene både gratis innhold og
                  funsjonalitet, og innhold og funksjonalitet som er lagt bak
                  betaling. MT forbeholder seg retten til å legge til
                  funksjonalitet som vil medføre gebyrer, og legge gebyrer på
                  eksisterende funksjonalitet. Det vil ikke påløpe kostnader for
                  eksisterende brukere uten at dette er varslet.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                3. Brukers forpliktelser
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker skal kun benytte Tjenestene som beskrevet i
                Brukervilkårene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker plikter å oppgi riktig informasjon ved bruk av
                Tjenestene. Det omfatter blant annet boliginformasjon som f.eks.
                andelsnummer, fellesgjeld, linker, antall rom, soverom,
                primærrom, bruksareal, etasje, byggeår, prisantydning,
                dokumentasjon og andre relevante opplysninger som blir
                etterspurt.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker er selv ansvarlig for eventuelle tap som følge av bruk av
                Tjenestene, herunder, men ikke begrenset til, tap som følge av
                at Bruker har gitt andre tilgang til sin brukerprofil eller at
                andre har fått slik tilgang som følge av forhold på Brukers
                side.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker skal ikke på ulovlig måte aksessere dataressurser som
                Tjenestene gir tilgang til eller på annen måte uberettiget
                tilegne seg data. Dette inkluderer også forbud mot skraping
                (“crawling”), indeksering eller tilgang gjennom maskinlesbare
                grensesnitt. Det samme gjelder andre forsøk på å bryte
                sikkerheten eller unødvendig forstyrre eller vanskeliggjøre
                andres bruk av Tjenestene. Dersom Bruker uforvarende får tilgang
                til tredjeparts data, skal Bruker umiddelbart varsle Tjenestene
                og slette eventuelle data som Bruker har mottatt.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Dersom Bruker oppdager feil, mangler, uregelmessigheter eller
                annet som kan være av betydning for MT som leverandør av
                Tjenestene, skal Bruker varsle om dette i tråd med
                Brukervilkårenes pkt. 6.1.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker plikter å sende eventuelle forespørsler til Tjenestene på
                en saklig og informativ måte.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Om Bruker ved endring av sin kontaktinformasjon (e-postadresse
                og/eller telefonnummer) ikke oppdaterer dette i Tjenestene, er
                ikke MT ansvarlig om varsler, meldinger, og/eller henvendelser
                ikke blir mottatt.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                4. Eiendomsdata, Brukerdata og deling
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenesten skiller mellom dokumentasjon, bilder og øvrige data
                knyttet til en spesifikk eiendom eller bolig («Eiendomsdata»),
                og dokumentasjon, bilder og øvrige data knyttet til Bruker som
                er lastet opp i et separat, personlig område i Tjenesten
                («Brukerdata»).
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Eiendomsdata kan være lastet opp av en profesjonell part, av
                Bruker eller av tidligere hjemmelshavere. Informasjon om
                egenskaper og fasiliteter for en bolig vil være offentlig
                tilgjengelig. Eiendomsdata vil være tilgjengelig for senere
                hjemmelshavere. Dersom eiendommen skifter hjemmelshaver gjennom
                en hjemmelsoverdragelse i Matrikkelen, vil tidligere
                hjemmelshaver miste administrator-tilgang, som går over til ny
                hjemmelshaver.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Nåværende hjemmelstaker har anledning til å gi
                administrator-tilgang til Eiendomsdata tilhørende sin
                bolig/tomt. Denne administrator-tilgangen vil være gjeldende
                inntil (a) hjemmelstaker trekker denne tilbake, eller (b)
                eiendommen skifter hjemmelshaver gjennom en hjemmelsoverdragelse
                i Matrikkelen.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Brukerdata vil følge Bruker uavhengig av hvilken eiendom Bruker
                er hjemmelshaver til. Brukerdata er ikke tilgjengelig for andre
                enn Bruker.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT får en begrenset og overførbar disposisjonsrett til
                Eiendomsdata. Disposisjonsretten omfatter de rettigheter som er
                nødvendig for å bruke Eiendomsdata til:
              </p>
              <ul className="list-disc pl-5">
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Videreformidling av Eiendomsdata til
                  ferdigshus/hytte-produsenter og finansielle
                  samarbeidspartnere.
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Videreformidling av Eiendomsdata til andre relevante parter
                  for å overholde forpliktelser
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Videreformidling av Eiendomsdata til offentlige myndigheter,
                  herunder samfunnskritiske inspeksjoner og tilsyn, for eksempel
                  elektriske installasjoner og brannforebygging
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Videreutvikling av Tjenestene og utvikling av nye tjenester og
                  produkter
                </li>
                <li className="text-secondary text-sm md:text-base desktop:text-lg">
                  Utarbeidelse av statistikk
                </li>
              </ul>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker kan i Tjenestene velge å gjøre Eiendomsdata offentlig,
                slik at denne informasjonen blir tilgjengelig for alle brukere
                av Tjenestene. Andre brukere får kun lesetilgang og kan ikke
                gjøre endringer i Eiendomsdata.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker kan når som helst selv stoppe deling av Eiendomsdata.
                Innsynet vil da reverseres til å kun vise en anonymisert
                oppsummering av mengden dokumentasjon som er registrert på
                boligen, samt hvilke håndverkere som har lastet opp dokumenter
                tilhørende boligen (FDV dokumentasjon) som kan være en del av
                Bruker kundeportal.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                5. Samtykke til varsler, henvendelser og markedsføring
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Ved aksept av Brukervilkårene gir Bruker MT tillatelse til å
                benytte Tjenestene og den kontaktinformasjon som Bruker har
                oppgitt til å rette varsler og henvendelser til Bruker.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Markedsføring og mer generelle henvendelser som ikke er en
                naturlig del av Tjenestene, sendes ikke Bruker om ikke Bruker
                aktivt har samtykket til det under sine profilinnstillinger.
                Markedsføring vil gjelde informasjon som blir ansett som
                relevant for Bruker basert på Brukers bolig/tomt og Brukers bruk
                av Tjenestene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Varsel til MT i forbindelse med Brukervilkårene skal skje
                skriftlig og sendes til iPlot AS, Sokkabekkveien 81, 3478
                Nærsnes. Alternativt via kontaktskjemaet til kundeservice her.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Varsel til Bruker i forbindelse med Brukervilkårene skal skje
                skriftlig og sendes til den e-postadresse og/eller telefonnummer
                som Bruker har oppgitt i Tjenestene.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                6. Behandling av personopplysninger
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT vil behandle personopplysninger om Bruker som et ledd i
                ytelsen av Tjenestene. Dette er for å gjøre Tjenestene tilpasset
                Bruker og for å forbedre Tjenestene generelt. MT og Tjenestene
                vil alltid rette seg etter relevante bestemmelser om personvern
                og informasjonssikkerhet i personopplysningsloven. Nærmere
                informasjon om behandlingen av personopplysninger følger av
                personvernerklæringen.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                7. Bruk av informasjonskapsler
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene bruker kun informasjonskapsler (heretter “cookies”)
                der det er nødvendig. Det inkluderer sesjonavhengige cookies og
                cookies for måling av bruk og ytelse.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                For mer informasjon om Tjenestenes bruk av cookies, og editering
                av hvilke cookie-valg Bruker har lagret, se
                cookies-innstillingene på Brukers Profilside.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                8. Ansvarsfraskrivelse
              </h4>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  8.1. Generelt
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestene blir levert "som de er" og (as-is) som de er
                  tilgjengelig og så langt det er mulig etter loven, uten
                  garantier av noe slag, inkludert, men ikke begrenset til,
                  implisitte garantier, betingelser eller andre vilkår relatert
                  til salgbarhet, tilfredsstillende kvalitet, egnethet for et
                  spesielt formål, tittel, råderett, ukrenkelighet, eller som
                  fremkommer som resultat av forhandlinger.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  I tillegg, mens MT forsøker å levere gode brukeropplevelser,
                  påstår eller garanterer MT ikke at: (a) Tjenestene alltid vil
                  være sikker, eller feilfri; (b) Tjenestene alltid vil fungere
                  uten forsinkelser, avbrudd eller feil; eller (c) at alt
                  innhold eller informasjon Bruker mottar via Tjenestene vil
                  være presis eller riktig. MT sitt ansvar omfatter ikke feil,
                  mangler eller driftsforstyrrelser knyttet til utstyr,
                  programvare, tilgang til eller overføring over internett eller
                  autentiseringsløsning (Vipps Logg inn, og/eller annet
                  tilsvarende sikkerhetsinstrument).
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestene er basert på at Bruker selv sørger for å beskytte
                  sine data mot innsyn fra uvedkommende. MT har intet ansvar for
                  data som Bruker sender eller mottar ved bruk av Tjenestene.
                  Videre har MT intet ansvar for tap i forbindelse med
                  ødeleggelse av Brukers data, avbrudd, ikke levert data,
                  feilaktig levert data, Force Majeure, nekting, fjerning eller
                  sletting av meldinger, dokumenter, eller andre data. MT har
                  heller ikke ansvar for om en tredjepart henter data registrert
                  på en bolig i Tjenestene uten å ha innhentet nødvendig
                  samtykke fra Bruker.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  MT garanterer heller ikke at informasjonen som fremstilles i
                  Tjenestene er uttømmende. MT fraskriver seg ethvert
                  erstatningsansvar som måtte påberopes som følge av bruk av
                  Tjenestene, det være seg direkte eller indirekte tap
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  8.2. Tredjepartsinnhold
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Mye av innholdet i Tjenestene er produsert av tredjeparter
                  (heretter «Tredjepartsinnhold»). Tredjeparter som sendte
                  innholdet er helt og holdent ansvarlig for dens riktighet.
                  Bruker forstår og aksepterer at Bruker kan bli eksponert for
                  feilaktig informasjon.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  8.3 Verdiestimatet
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  MT understreker at verdiestimatet som fremstilles er et
                  estimat av boligens nåværende markedsverdi og utgjør ikke
                  nødvendigvis et korrekt bilde av boligprisen eller boligens
                  reelle verdi. Tjenestene som forbrukerplattform og verktøy
                  muliggjør kun at Bruker kan bruke disse til å få innsikt i sin
                  bolig/tomt og ferdighusmarkedet.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                9. Skadesløsholdelse
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker skal holde MT skadesløs i den utstrekning MT mottar krav
                fra eller pålegges ansvar overfor tredjepart og kravet eller
                ansvaret er basert på Brukers krenkelse eller medvirkning til
                krenkelse av andres lovbeskyttede rettigheter (inkludert men
                ikke begrenset til opphavsrett eller tilgrensende rettigheter,
                patent, varemerke, design, know-how eller bedriftshemmelighet),
                eller brudd på eller medvirkning til brudd på lov, forskrift
                eller myndighetsavgjørelse og/eller Brukervilkårene ved bruk av
                Tjenestene. Dersom et slikt krav rettes mot MT og/eller
                Tjenestene skal Bruker dekke, foruten det direkte økonomiske
                tap, også utgifter til bistand for å håndtere kravet på en
                forsvarlig måte samt andre utgifter som står i en rimelig
                sammenheng med tredjeparts krav. Dersom Bruker blir kjent med at
                krav vil bli reist mot MT i forbindelse med Brukers bruk av
                Tjenestene, skal Bruker umiddelbart varsle MT.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                10. Jurisdiksjon og verneting
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Avtalen mellom Bruker og MT er i sin helhet regulert av norsk
                rett. Dersom det oppstår tvist mellom Bruker og MT om tolkningen
                eller rettsvirkningene av avtalen, skal tvisten først søkes løst
                i minnelighet. Dersom slike forhandlinger ikke fører frem, kan
                hver av partene forlange tvisten avgjort med endelig virkning
                ved alminnelige domstoler. Partene vedtar Oslo tingrett som
                verneting.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                11. Endringer av brukervilkårene
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT forbeholder seg retten til å gjøre endringer i eller
                tilføyelser til Brukervilkårene. Siste versjon av
                Brukervilkårene vil gjøres tilgjengelig på våre nettsider. MT
                vil varsle som anvist i pkt 6 ved vesentlige endringer i
                Brukervilkårene. Ved å fortsette å bruke Tjenestene aksepterer
                Bruker de endringene og tilføyelsene som er annonsert.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                12. Overføring av avtalen
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT kan fritt overdra sine rettigheter og plikter i henhold til
                disse Brukervilkårene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker kan ikke overføre sin registrerte Bruker til andre.
                Bruker kan ikke forhindre ny hjemmelshaver til bolig tidligere
                eiet av Bruker tilgang til registrert informasjon og
                dokumentasjon om den aktuelle boligen.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                13. Avslutte kundeforholdet
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker kan uten forvarsel velge å avslutte kundeforholdet med
                Tjenestene. Bruker kan selv avslutte sin bruk av Tjenestene ved
                å slette sin registrerte bruker via Brukers profilside i
                Tjenestene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT kan avslutte eller suspendere Brukerens tilgang til
                Tjenestene dersom MT har grunn til å tro at: (i) Bruker har
                misligholdt Brukeravtalen, (ii) Bruker skaper risiko eller mulig
                juridisk eksponering for MT; (iii) Brukers tilgang bør fjernes
                som følge av ulovlig oppførsel, (iv) Brukers konto bør fjernes
                på grunn av langvarig inaktivitet; eller (v) levering av
                Tjenestene til Bruker ikke lenger er kommersielt levedyktig. MT
                vil gjøre rimelige anstrengelser for å varsle Bruker via
                e-postadressen knyttet til Brukers brukerprofil.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Ved oppsigelse opphører Brukers tilgang til Tjenestene. Bruker
                vil ha adgang til data om Bruker i tre måneder etter
                oppsigelsen, deretter slettes data om Bruker. Bruker er selv
                ansvarlig for å ta kopi av alle data Bruker ønsker å beholde
                etter oppsigelsen.
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </>
  );
};

export default Brukervilkaar;
