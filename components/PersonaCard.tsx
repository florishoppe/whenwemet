interface PersonaCardProps {
  bio: string;
  followUpQuestions: string[];
  imageUrl?: string;
}

export default function PersonaCard({ bio, followUpQuestions, imageUrl }: PersonaCardProps) {
  return (
    <div className="card-dark w-full max-w-2xl rounded-lg p-8">
      {imageUrl && (
        <div className="mb-6 flex justify-center w-full">
          <img
            src={imageUrl}
            alt="Persona"
            className="w-full max-w-full rounded-lg object-cover aspect-video"
          />
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-black text-[#F97068]">JE BIO</h3>
        <div className="prose prose-sm max-w-none text-[#F5E8DC]/90">
          {bio.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-xl font-black text-[#F97068]">VERVOLGVRAGEN</h3>
        <ul className="space-y-3">
          {followUpQuestions.map((question, index) => (
            <li key={index} className="text-[#F5E8DC]/80">
              {question}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

