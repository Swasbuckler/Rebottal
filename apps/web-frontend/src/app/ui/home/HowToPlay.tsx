import MaxWidthContainer from "../components/MaxContainer";

export default function HowToPlay({
  id,
}: {
  id?: string
}) {

  return (
    <MaxWidthContainer id={id}>
      <div className="flex flex-col p-5 items-center w-full">
        <h1 className="mt-20 mb-10 text-6xl font-bungee">How To Play</h1>
      </div>
    </MaxWidthContainer>
  );
}