"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  MongoDBMark,
  MySQLMark,
  PostgreSQLMark,
  SQLiteMark,
  SqlServerMark,
} from "@/components/brand-icons";

/* Each chip carries the real product mark in neutral ink instead of an
   anonymous bullet — same icons as database-support.tsx. */
const databases = [
  { name: "PostgreSQL", icon: PostgreSQLMark },
  { name: "MySQL", icon: MySQLMark },
  { name: "SQLite", icon: SQLiteMark },
  { name: "SQL Server", icon: SqlServerMark },
  { name: "MongoDB", icon: MongoDBMark },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient absolute inset-0 pointer-events-none" />
      <div className="grid-pattern absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative container pt-20 pb-16 sm:pt-28 sm:pb-24 md:pt-32 md:pb-28">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Release line — plain muted text, deliberately not a pill. */}
          <p className="text-small text-muted-foreground mb-8 animate-fade-in">
            <span className="font-medium">v3.0.0</span>
            <span className="mx-2" aria-hidden="true">
              |
            </span>
            MongoDB support
          </p>

          <h1 className="text-display mb-6 animate-slide-up">
            Build faster with{" "}
            <span className="gradient-text">Stabilize ORM</span>
          </h1>

          <p
            className="text-body-lg text-muted-foreground max-w-2xl mb-10 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            A type-safe ORM for Bun that runs the same models against
            PostgreSQL, MySQL, SQLite, SQL Server, and MongoDB. Define models,
            run migrations and query data through one interface.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-body px-8 h-12 rounded-xl"
            >
              <Link href="/docs/quick-start">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-border hover:bg-accent-subtle hover:text-accent-subtle-foreground text-body px-8 h-12 rounded-xl"
            >
              <Link href="/examples">
                View Examples
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div
            className="mt-12 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-small text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            {databases.map((db) => (
              <div key={db.name} className="flex items-center gap-1.5">
                {/* inherits currentColor from the muted parent */}
                <db.icon className="h-3.5 w-3.5 shrink-0" />
                <span>{db.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
