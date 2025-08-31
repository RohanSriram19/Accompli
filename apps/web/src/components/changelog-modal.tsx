'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ChangelogEntry {
  version: string
  date: string
  type: 'feature' | 'fix' | 'improvement' | 'breaking'
  title: string
  description: string
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.2.0',
    date: '2024-08-31',
    type: 'feature',
    title: 'View Changelog',
    description: 'Added changelog modal to track platform updates and improvements.'
  },
  {
    version: '1.1.3',
    date: '2024-08-30',
    type: 'improvement',
    title: 'Research-Aware AI Assistant',
    description: 'Enhanced AI assistant with access to evidence-based research from WWC, Cochrane, and other educational databases.'
  },
  {
    version: '1.1.2',
    date: '2024-08-29',
    type: 'feature',
    title: 'IEP Goal Generator',
    description: 'Added AI-powered IEP goal generator that creates SMART goals aligned with research-based practices.'
  },
  {
    version: '1.1.1',
    date: '2024-08-28',
    type: 'improvement',
    title: 'Behavior Analytics',
    description: 'Improved ABC event analysis with pattern recognition and intervention suggestions.'
  },
  {
    version: '1.1.0',
    date: '2024-08-27',
    type: 'feature',
    title: 'Real-time Behavior Logging',
    description: 'Added real-time behavior event logging with offline sync capabilities for mobile devices.'
  },
  {
    version: '1.0.5',
    date: '2024-08-26',
    type: 'fix',
    title: 'Authentication Improvements',
    description: 'Fixed session persistence issues and improved role-based access control.'
  }
]

interface ChangelogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangelogModal({ open, onOpenChange }: ChangelogModalProps) {
  const getTypeColor = (type: ChangelogEntry['type']) => {
    switch (type) {
      case 'feature':
        return 'bg-green-100 text-green-800'
      case 'improvement':
        return 'bg-blue-100 text-blue-800'
      case 'fix':
        return 'bg-yellow-100 text-yellow-800'
      case 'breaking':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Modal */}
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg rounded-lg max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Platform Updates</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
        
        {/* Content */}
        <div className="space-y-6">
          {changelog.map((entry, index) => (
            <div key={entry.version} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">v{entry.version}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(entry.type)}`}>
                    {entry.type}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(entry.date)}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {entry.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {entry.description}
                </p>
              </div>
              
              {index < changelog.length - 1 && (
                <div className="border-t border-gray-200 mt-4"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> This platform is FERPA compliant and uses only anonymized, 
            research-based data to power AI features. No real student IEP data is used for AI training.
          </p>
        </div>
      </div>
    </>
  )
}
