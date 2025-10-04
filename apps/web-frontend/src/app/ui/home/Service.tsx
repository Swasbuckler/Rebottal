import MaxWidthContainer from "../components/MaxContainer";

export default function Service({
  id
}: {
  id?: string
}) {

  return (
    <MaxWidthContainer id={id}>
      <div className="flex flex-col p-5 items-center w-full">
        <h1 className="mt-20 mb-10 text-6xl font-bungee">Rebottal</h1>
        <p>A game hosted on this website where you can discuss with AI chatbot personalities about a topic you have given or randomly selected.</p>
      </div>
    </MaxWidthContainer>
  );
}