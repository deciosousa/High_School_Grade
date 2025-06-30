/*
  Warnings:

  - You are about to drop the column `specialty` on the `professores` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "disciplina_professores" DROP CONSTRAINT "disciplina_professores_professorId_fkey";

-- DropForeignKey
ALTER TABLE "disciplina_professores" DROP CONSTRAINT "disciplina_professores_turmaId_fkey";

-- AlterTable
ALTER TABLE "disciplina_professores" ALTER COLUMN "professorId" DROP NOT NULL,
ALTER COLUMN "turmaId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "professores" DROP COLUMN "specialty";

-- AddForeignKey
ALTER TABLE "disciplina_professores" ADD CONSTRAINT "disciplina_professores_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplina_professores" ADD CONSTRAINT "disciplina_professores_turmaId_fkey" FOREIGN KEY ("turmaId") REFERENCES "turmas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
