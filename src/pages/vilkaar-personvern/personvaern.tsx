"use client";
import SideSpaceContainer from "@/components/common/sideSpace";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import Ic_breadcrumb_arrow from "@/public/images/Ic_breadcrumb_arrow.svg";

const Personvaern = () => {
  return (
    <div>
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
              Personvernerklæring
            </span>
          </div>
          <h3 className="text-black font-semibold text-lg md:text-2xl desktop:text-[30px]">
            Personvernerklæring
          </h3>
        </SideSpaceContainer>
      </div>
      <div className="pt-8 pb-32">
        <SideSpaceContainer>
          <div className="flex flex-col gap-4 md:gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
              <h1 className="text-black font-bold text-lg md:text-xl desktop:text-2xl">
                Personvernerklæring for MinTomt
              </h1>
              <p className="font-semibold text-xs md:text-sm desktop:text-base">
                03. mai. 2025
              </p>
            </div>
            <h6 className="text-base font-semibold desktop:text-xl">
              Personvernerklæring
            </h6>
            <div className="flex flex-col gap-2.5 md:gap-4">
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Personvernreglene beskytter informasjon du (heretter “Bruker”)
                legger igjen på nettet, og regulerer hva tjenestene mintomt.no
                og eventuelle underdomener og inkl. evt. tilknyttede
                mobilapplikasjoner (heretter “Tjenestene”), og iPlot AS (org.
                nr. 834 632 772) som behandlingsansvarlig (heretter “MT”) og
                andre kan bruke din informasjon til. Merk at iPlot AS ifm sitt
                bedriftsområde på mintomt.no har egen personvernserklæring for
                bedrifter, utover denne personvernerklæringen som gjelder for
                privatpersoner. Mintomts personvernerklæring for bedrifter kan
                leses her.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                iPlot AS er et teknologiselskap majoritetseid av Fenger Holding
                AS, org. nr. 923 769 854 og Simen S. Wolmer.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                MT er som teknologiselskaper opptatt av å beskytte og respektere
                personvernet til våre brukere. Vi bryr oss om personvern og er
                klar over at vi kontinuerlig må fortjene og holde på Brukers
                tillit. Vi jobber for å bygge produkter som vi selv benytter og
                er stolte av. Vårt løfte til Bruker er å være åpne om hva vi
                gjør, og alltid fokusere på det som hjelper våre brukere.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Når du bruker Tjenestene, gir du Tjenestene og MT tilgang til
                opplysninger om deg. Denne personvernerklæringen er skrevet med
                formål å gjøre det enklere å forstå hvilke opplysninger vi
                samler inn, hvordan og hvorfor vi gjør det, og hva vi bruker
                opplysningene til.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                All innsamling og bruk av personopplysninger er underlagt norsk
                personvernlovgivning, herunder personopplysningsloven og
                forskrift om utlevering, viderebruk og annen behandling av
                opplysninger fra grunnboken og matrikkelen
                («utleveringsforskriften»).
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Dersom du aksepter at Tjenestene formidler personopplysninger
                til tredjepart, vil disse ha et selvstendig ansvar for sin
                videre behandling av opplysningene. Det samme gjelder
                opplysninger du utveksler med andre nettsteder etter å ha fulgt
                lenker i Tjenestene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene innhenter og behandler enkelte data fra grunnboken og
                matrikkelen i våre egne registre. Denne behandlingen er regulert
                av utleveringsforskriften. Dersom vi etter avtale utleverer
                slike data videre, er mottakeren ansvarlig for å behandle
                dataene i samsvar med kravene i utleveringsforskriften. Herunder
                kan ikke opplysninger brukes til reklame- eller
                markedsføringsformål uten samtykke fra den dataene gjelder, og
                enkelte data skal kun være tilgjengelig med tilgangskontroll og
                begrensninger i antall søk.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                1. Hvilken informasjon samler Tjenestene inn om Bruker?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene samler inn personopplysninger som:
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                registreres automatisk når Bruker benytter Tjenestene under
                forutsetning av cookie-samtykke. Eksempelvis hvilke sider Bruker
                besøker, linker Bruker trykker på, hvilken teknologi Bruker
                benytter, hvor mye tid Bruker bruker i Tjenestene, IP-adresse og
                lignende. Basert på Brukers IP-adresse eller andre former for
                lokalisering blir geografisk posisjon registrert
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker oppgir til Tjenestene. Eksempelvis når Bruker registrerer
                brukerkonto, editerer egenskaper og/eller dokumenter tilhørende
                Brukers bolig(er), kontakter en av partnerne presentert i
                Tjenestene, abonnerer på nyhetsbrev, gir tilbakemelding eller
                har spørsmål
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene mottar fra tredjeparter. Eksempelvis andre
                tjenesteytere, offentlige registre og andre offentlig
                tilgjengelige kilder. Ved at Bruker tar tjenestene i bruk mottar
                tjenestene grunnleggende personopplysninger, som personnummer og
                navn, gjennom Vipps Logg inn. Informasjon tilknyttet matrikkel
                og grunnbok mottar Tjenestene fra Statens Kartverk, som er et
                offentlig selskap. Personnummer bruker Tjenestene kun for å
                identifisere hvilke bolig(er) Bruker er hjemmelshaver til.
                E-postadresse og telefonnummer brukes til å varsle Bruker om
                avbrudd i Tjenestene, ved viktige nyheter og endringer, i
                tillegg til generell informasjon om Bruker manuelt har meldt seg
                på tilknyttet nyhetsbrev.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Informasjonen lagres enten i Tjenestenes databaser eller på
                enheten Bruker benytter (laptop, mobiltelefon, tablet etc.).
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                2. Hva brukes informasjonen til?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Under følger en oversikt over hvilke formål behandlingen av
                personopplysningene kan ha, hva formålet skal føre til, og hva
                som er det rettslige grunnlaget.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Under listes de forskjellige kategoriene innen{" "}
                <span className="text-black font-medium">
                  behandling / registrering:
                </span>
              </p>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.1 Overholdelse av lovfestede plikter
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.1.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Tjenestene behandler personopplysninger for å oppfylle
                    rettslige og lovfestede forpliktelser, eksempelvis for
                    rapportering og for å legge frem opplysninger for
                    myndighetene når dette er lovpålagt.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.1.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Rettslig forpliktelse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.2 Registrere og administrere brukerprofil, inkl. innhenting
                  av Brukers personnummer fra Vipps Logg Inn
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.2.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For at Bruker skal kunne åpne konto, administrere sin
                    brukerprofil, og få tilgang til en god, sikker og lovlig
                    tjeneste. Personnummer brukes for å kunne identifisere
                    hvilke bolig(er) som er registrert på Bruker i
                    Eiendomsregisteret hos Statens kartverk (Matrikkelen).
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.2.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Oppfyllelse av avtale.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.3 Vise hjemmelshaver(e) og Bruker med administratortilgang
                  til bolig
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.3.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Brukers navn vises tilknyttet en bolig hvor Bruker er én av
                    flere hjemmelshavere. Brukers navn vises også tilknyttet en
                    bolig hvor Bruker har fått innvilget administratortilgang.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.3.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Oppfyllelse av avtale.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.4 Sende viktig informasjon til Bruker
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.4.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å kunne sende tjeneste-informasjon og varsler som
                    påvirker Brukers bruk av eller tilgang til Tjenestene.
                    F.eks. oppdatering av vilkår og systemvarslinger, og varsler
                    om opplasting av dokumenter til Brukers bolig(er).
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.4.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Oppfyllelse av avtale.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.5 Motta og besvare henvendelser fra Bruker
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.5.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Når Bruker sender henvendelser til Tjenestene, vil Brukers
                    kontaktopplysninger benyttes for å kunne besvare
                    henvendelsen.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.5.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Oppfyllelse av avtale.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.6 Registrere, lagre og tilgjengeliggjøre dokumentasjon om
                  boligen (FDV)
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.6.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å dokumentere fakta om boligen, herunder dokumentasjon
                    på arbeid og oppgraderinger. Slik dokumentasjon vil kunne
                    inneholde personopplysninger (særlig navn og
                    kontaktinformasjon) om boligens eier på tidspunktet for
                    utarbeidelse av dokumentasjonen, samt håndverkere eller
                    andre utstedere av dokumentasjon.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.6.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Berettiget interesse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.7 Analyse, forbedring og videreutvikling av Tjenestene
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.7.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å kunne gi Bruker den beste mulige opplevelse og verdi
                    av bruken av Tjenestene, vil Tjenestene benytte informasjon
                    om hvordan Bruker bruker Tjenestene til forbedring og
                    videreutvikling.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.7.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Berettiget interesse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.8 Tilpasning av innhold til Bruker
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.8.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å spare Bruker for tid, og vise relevant innhold Brukers
                    atferdsmønster viser høyest interesse for. Eksempelvis kan
                    Bruker se lignende boliger av boliger Bruker har vist
                    interesse for tidligere.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.8.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Berettiget interesse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.9 Hindre, begrense, og granske misbruk av Tjenestene
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.9.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å sørge for god sikkerhet i løsningen, og at Tjenestene
                    tilpasses Brukers behov og preferanser.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.9.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Berettiget interesse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.10 Markedsføring av Tjenestene i eksterne kanaler
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.10.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å kunne gi Bruker personalisert markedsføring av
                    Tjenestene via tilbydere som eksempelvis Google og Facebook.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.10.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Berettiget interesse.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.11 Sende persontilpasset informasjon til Bruker
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.11.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å kunne sende Bruker nyhetsbrev og annen informasjon som
                    Bruker.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.11.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Samtykke.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.12 Registrere oppdrag og formidle kontakt med
                  leverandørpartnere av Tjenestene
                </h4>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.12.1 Formål
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    For å kunne sette Bruker i kontakt med relevante
                    leverandører av tjenester som Bruker eksempelvis har
                    samtykket til å motta tilbud og/eller kontakt fra.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                    2.12.2 Rettslig grunnlag
                  </h4>
                  <p className="text-secondary text-sm md:text-base desktop:text-lg">
                    Samtykke.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  2.13 Forklaring av terminologi presentert i “Rettslig
                  grunnlag”-kolonnen
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Rettslig forpliktelse. Behandlingen er nødvendig for å
                  oppfylle en rettslig forpliktelse som påhviler den
                  behandlingsansvarlige, GDPR art 6 nr 1
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Oppfyllelse av avtale. Behandlingen er nødvendig for å
                  oppfylle Tjenestenes forpliktelser i henhold til avtalen med
                  Bruker, eller for å gjennomføre tiltak på Brukerens
                  forespørsel før avtaleinngåelse, jf. GDPR art 6 nr 1 (b)
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Berettiget interesse. Når Tjenestene i et enkelt tilfelle har
                  en berettiget interesse av å behandle personopplysninger som
                  veier tyngre enn den registrertes interesser eller
                  rettigheter, jf. GDPR art 6 nr 1 (f)
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Samtykke. Når Bruker aktivt har samtykket til at Tjenestene
                  kan benytte Brukers personopplysninger for et eller flere
                  spesifikke formål, jf. GDPR art 6 nr 1 (a)
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                3. Hvem kan få Brukers personopplysninger utlevert?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene deler i enkelte tilfeller personopplysninger med
                andre bedrifter og organisasjoner utenfor MT. Dette er for å
                kunne gi Bruker bedre og tryggere produkter og tjenester.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene kan utlevere personopplysninger til:
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Selskaper eid eller delvis eid av Fenger Holding AS/Simen Wolmer
                når Bruker samtykker eller det er tillatt i henhold til
                gjeldende lovgivning
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Samarbeidspartnere og underleverandører vil kunne få innsyn i
                opplysninger hvis dette er nødvendig for å utføre tjenester for
                Tjenestene, eksempelvis for å analysere bruken av Tjenestene. I
                slike tilfeller inngås databehandleravtaler for å ivareta
                informasjonssikkerheten, og våre samarbeidspartnere kan ikke
                bruke personopplysningene til andre formål enn å yte tjenesten
                som er avtalt med Tjenestene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestenes data lagres i EFTA/EU-området, men enkelte av
                tjenesteleverandørene kan ha support-personell utenfor dette
                området (eks Amazon Web Services), og dermed ha tilgang til
                personopplysninger forutsatt at man oppfyller enkelte
                tilleggskrav for beskyttelse av dataene
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                I andre tilfeller kan det også være behov for å utlevere
                informasjon:
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                I lovbestemte tilfeller til offentlige myndigheter, eksempelvis
                ved pålegg fra domstolene, politiet eller andre, i henhold til
                strenge forhåndsdefinerte prosesser
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                I forbindelse med virksomhetsoverdragelse, f.eks. som ledd i
                fusjon, oppkjøp, salg av MT og/eller Tjenestene, eller
                overføring av Tjenestene til et annet selskap
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Til tvistemotpart eller andre for å avklare eventuelle tvister
              </p>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  3.1 Deling av personopplysninger tilknyttet deling av
                  informasjon til fagfolk
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Data og informasjon tilknyttet en bolig kan deles der relevant
                  med fagfolk (eks ferdishus/hytte-produsenter, samarbeidende
                  finansielle samarbeidspartnere, håndverkere, el-tilsyn,
                  bygningssakkyndig, eiendomsmeglere etc.) når de skal innhente
                  denne typen informasjon. Slik data og informasjon kan
                  inneholde personopplysninger i form av Brukers navn, hvorav
                  dette er allerede offentlig tilgjengelig informasjon via
                  Kartverket.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  3.2 Offentlig deling av data og informasjon
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Bruker kan velge å offentlig dele tilgang til informasjon og
                  dokumenter tilknyttet bolig(er) hvor Bruker er hjemmelshaver
                  eller har administratortilgang. Når Bruker deler data og
                  informasjon om boligen offentlig, kan f.eks. potensielle
                  boligkjøpere få et innblikk i boligens dokumentasjon og
                  tilstand. Varigheten av en offentlig deling spesifiseres av
                  Bruker. Andre brukere får kun lesetilgang og kan ikke gjøre
                  endringer.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                4. Hvordan kan Bruker administrere sine personverninnstillinger?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene har personverninnstillinger og verktøy for å gjøre
                det enklere for Bruker å administrere sine personopplysninger.
                Bruker har adgang til å administrere sine personopplysninger når
                man er logget inn i Tjenestene.
              </p>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  4.1 Behandle personverninnstillinger
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Bruker kan se gjennom og endre personopplysninger som navn,
                  e-post og telefonnummer via sin profil-side.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Brukers navn mottar Tjenestene fra innloggingsløsningen, Vipps
                  Logg inn, som Bruker har benyttet. Brukers navn må således
                  oppdateres hos disse aktørene for å bli oppdatert i
                  Tjenestene.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Brukers telefonnummer mottar Tjenestene fra
                  innloggingsløsningen Vipps Logg inn i de tilfeller hvor Bruker
                  har benyttet dette. Om telefonnummeret lagret i Brukers profil
                  i Tjenestene avviker fra telefonnummer mottatt fra Vipps Logg
                  inn, vil telefonnummer fra Vipps Logg inn erstatte det
                  eksisterende telefonnummeret i Tjenestene.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  4.2 Administrere samtykke til informasjonskapsler
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestene benytter som leverandør av samtykkeløsning for
                  informasjonskapsler (heretter “cookies”). Bruker kan editere
                  sine samtykker via Cookie Information-valgpanelet som Bruker
                  åpner fra sin profilside, menyen, via lenke fra
                  Brukervilkårene og Personvernerklæringen.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Bruker kan administrere sitt samtykke til informasjonskapsler
                  via sin profilside her.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                5. Hvordan kan Bruker slette lagrede personopplysninger?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestene lagrer ikke personopplysninger lengre og i større
                grad enn det som er nødvendig for å oppfylle formålet med
                behandlingen med mindre det er lovpålagt, f.eks. gjennom
                regnskapsloven. Personopplysninger slettes automatisk når de
                ikke lenger er nødvendige for å oppfylle formålet de ble
                innhentet for.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker har rett til innsyn i Tjenestenes behandling av
                personopplysninger om seg. Bruker har også rett til å kreve
                opplysninger rettet og slettet, og til å protestere mot
                behandling av personopplysninger med hjemmel i berettiget
                interesse.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Bruker kan også selv be om at Tjenestene sletter lagrede
                personopplysninger om seg ved å slette sin brukerkonto i
                Tjenestene. Brukers personopplysninger blir da slettet innen 30
                dager, med unntak av informasjon Tjenestene er pålagt å
                oppbevare. Sletting av personopplysninger fritar Bruker ikke for
                avtaler og forpliktelser Bruker måtte ha overfor MT, Tjenestene
                eller tredjeparter.
              </p>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  5.1 Sletting av Brukers bolig(er), informasjon og/eller
                  opplastede dokumenter
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Sletting av Brukers brukerkonto sletter ikke boligen(e),
                  informasjon, data eller dokumentene som er lastet opp
                  tilknyttet boligen(e) av Bruker, profesjonelle (håndverkere,
                  meglere mm.), eller mottatt via andre kanaler (f.eks.
                  tidligere annonsering av boligen). Disse dokumentene er lagret
                  på boligens gårds- og bruksnummer, ikke på brukerkontoen eller
                  Bruker. Tjenestene må lagre denne informasjonen, slik at den
                  er tilgjengelig for andre hjemmelshavere (eiere), fremtidige
                  eiere, og for å sikre at profesjonelle har tilgang til egen
                  historikk. MT har en ubegrenset og overførbar bruksrett til
                  all informasjon og data som Bruker måtte legge inn i
                  Tjenestene.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Om Bruker endrer og/eller sletter informasjon og dokumenter
                  tilknyttet boligen(e) Bruker har hjemmel til eller er
                  administrator for, vil Tjenestene beholde en kopi av
                  dokumentet. Dette gjelder også i tilfellet hvor Bruker sletter
                  sin brukerkonto. Data og informasjon Bruker sletter vil ikke
                  lenger vises til brukere i Tjenestene, men kunne eksponeres
                  til profesjonelle (f.eks. bygningssakkyndig) og brukes inn i
                  aggregerte tjenester i Tjenestene.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Om Brukers brukerkonto slettes vil ikke Tjenestene slette
                  informasjon Bruker har editert om sin bolig. Eksempel på slik
                  infromasjon er kvadratmeter og fasiliteter. Denne
                  informasjonen følger boligen og vil være tilgjengelig for alle
                  brukere av Tjenestene, samt mulig å editere av andre
                  hjemmelshavere (eiere) og fremtidige eiere.
                </p>
              </div>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  5.2 Hvordan slettes personopplysninger fra sikkerhetskopier og
                  loggfiler
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Når Bruker sletter sin brukerkonto slettes personopplysninger
                  fra Tjenestenes sikkerhetskopier og arkiver etter ett år.
                  Tjenestene lagrer ikke sikkerhetskopier lenger enn ett år.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestene må lagre sikkerhetskopier, logger og dataarkiver i
                  ett år for å imøtekomme andre forpliktelser innen
                  databevaring. F.eks. for håndtering av kundeservicesaker,
                  undersøke eventuelle sikkerhetsbrudd, og overholdelse av
                  myndighetenes påbud og/eller juridiske forpliktelser. I
                  sikkerhetskopier og systemgenererte loggfiler er det ikke
                  lagret personopplysninger, og sikkerhetskopier av tjenestenes
                  data er kryptert for ekstra sikkerhet mot uautorisert tilgang.
                  Ved naturkatastrofer (force majeure) eller lignende, kan det
                  være at Tjenestene ser seg nødt til å lage en backup hvor data
                  om Bruker kan være inkludert.
                </p>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestenes driftspartner sikkerhetskopierer Tjenestenes
                  produksjonsmiljø. Sikkerhetskopiene lagres i samsvar med
                  IKT-Norges standard. I henhold til avtalen med Tjenestenes
                  driftspartnere sørger de for høy sikkerhet, inkludert fysisk
                  sikkerhet, for sikkerhetskopier og produksjonsmiljø.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                6. Hvordan behandles personopplysninger om Bruker
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Ved spørsmål til Tjenestene om behandling av personopplysninger
                om Bruker eller ønske om at opplysninger slettes, kan Bruker
                henvende seg til kundeservice via hei@iplot.no.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Dersom Bruker er misfornøyd med Tjenestenes behandling av
                personopplysninger eller har forslag til forbedringer, setter vi
                stor pris på om Bruker kontakter oss her. Bruker har også rett
                til å sende sin klage til Datatilsynet.
              </p>
              <div className="flex flex-col gap-1.5 pl-3">
                <h4 className="text-sm md:text-base desktop:text-lg font-semibold">
                  6.1 Hvordan behandles personopplysninger om barn?
                </h4>
                <p className="text-secondary text-sm md:text-base desktop:text-lg">
                  Tjenestene ønsker ikke å samle inn eller på annen måte
                  behandle personopplysninger om barn under 18 års alder. For å
                  opprette bruker i Tjenestene må man identifisere seg med
                  BankID, videre innlogginger skjer med Vipps Logg inn eller
                  BankID. Hvis barn under 18 år likevel har gitt Tjenestene
                  personopplysninger vil opplysningene slettes så snart
                  Tjenestene blir oppmerksomme på forholdet. Foresatte bes
                  kontakte Tjenestene her.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                7. Når gjelder personvernerklæringen?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Disse retningslinjene gjelder alle de av Tjenestenes
                applikasjoner og tjenester som behandler Brukers
                personopplysninger, men utelukker tjenester som har egne
                retningslinjer for personopplysninger som ikke innlemmer disse
                retningslinjene.
              </p>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Tjenestenes retningslinjer for personvern gjelder ikke
                tredjeparter som annonserer eller bruker Tjenestenes tjenester.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-black font-semibold text-base md:text-lg desktop:text-xl">
                8. Hvordan får Bruker vite om endringer i personvernerklæringen?
              </h4>
              <p className="text-secondary text-sm md:text-base desktop:text-lg">
                Retningslinjene for personvern kan endres og vil da bli
                oppdatert i Tjenestene på denne siden. Er endringene vesentlige
                vil Bruker motta et varsel slik at man kan se gjennom
                endringene. Bruker aksepterer endringer i personvernerklæringen
                ved påfølgende innlogging i Tjenestene etter at
                personvernerklæringen er oppdatert. Er Bruker ikke villig til å
                akseptere endringer i personvernerklæringen står Bruker fritt
                til å ikke logge inn i Tjenestene, samt har bruker anledning til
                å slette sin brukerprofil.
              </p>
            </div>
          </div>
        </SideSpaceContainer>
      </div>
    </div>
  );
};

export default Personvaern;
